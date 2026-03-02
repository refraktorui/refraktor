import { useId, useUncontrolled } from "@refraktor/utils";
import {
    KeyboardEvent,
    ReactNode,
    Ref,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    Input,
    useClassNames,
    useProps,
    useTheme
} from "@refraktor/core";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { getPickerSizeStyles } from "../picker-shared";
import {
    TimePickerClassNames,
    TimePickerFactoryPayload,
    TimePickerFormat,
    TimePickerProps,
    TimePickerValue
} from "./time-picker.types";

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const PLACEHOLDER = "--";

const defaultProps = {
    format: "24h" as TimePickerFormat,
    withSeconds: false,
    withDropdown: false,
    clearable: false,
    disabled: false,
    readOnly: false,
    variant: "default" as const,
    size: "md" as const,
    radius: "default" as const,
    hoursStep: 1,
    minutesStep: 1,
    secondsStep: 1,
    amPmLabels: { am: "AM", pm: "PM" },
    strategy: "fixed"
} satisfies Partial<TimePickerProps>;

type TimeParts = {
    hours: number | null;
    minutes: number | null;
    seconds: number | null;
    amPm: "AM" | "PM" | null;
};

const pad = (value: number) => String(value).padStart(2, "0");

const parseValue = (
    value: string | undefined,
    withSeconds: boolean
): TimeParts => {
    if (!value || value === "") {
        return { hours: null, minutes: null, seconds: null, amPm: null };
    }

    const segments = value.trim().split(":");
    if (segments.length < 2) {
        return { hours: null, minutes: null, seconds: null, amPm: null };
    }

    const hours = Number.parseInt(segments[0], 10);
    const minutes = Number.parseInt(segments[1], 10);
    const seconds =
        segments.length >= 3 ? Number.parseInt(segments[2], 10) : 0;

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        Number.isNaN(seconds) ||
        hours < 0 ||
        hours >= HOURS_IN_DAY ||
        minutes < 0 ||
        minutes >= MINUTES_IN_HOUR ||
        seconds < 0 ||
        seconds >= SECONDS_IN_MINUTE
    ) {
        return { hours: null, minutes: null, seconds: null, amPm: null };
    }

    return {
        hours,
        minutes,
        seconds: withSeconds ? seconds : null,
        amPm: hours >= 12 ? "PM" : "AM"
    };
};

const formatValue = (parts: TimeParts, withSeconds: boolean): string => {
    if (parts.hours === null || parts.minutes === null) {
        return "";
    }

    const base = `${pad(parts.hours)}:${pad(parts.minutes)}`;

    if (withSeconds) {
        return `${base}:${pad(parts.seconds ?? 0)}`;
    }

    return base;
};

const to12Hour = (hours24: number): number => {
    if (hours24 === 0 || hours24 === 12) return 12;
    return hours24 % 12;
};

const to24Hour = (hour12: number, amPm: "AM" | "PM"): number => {
    if (amPm === "AM") {
        return hour12 === 12 ? 0 : hour12;
    }
    return hour12 === 12 ? 12 : hour12 + 12;
};

const clampValue = (
    value: number,
    min: number,
    max: number,
    step: number
): number => {
    const clamped = Math.max(min, Math.min(max, value));
    return Math.round(clamped / step) * step;
};

const parseMinMax = (
    timeStr: string | undefined
): { hours: number; minutes: number; seconds: number } | null => {
    if (!timeStr) return null;
    const segments = timeStr.trim().split(":");
    if (segments.length < 2) return null;

    const hours = Number.parseInt(segments[0], 10);
    const minutes = Number.parseInt(segments[1], 10);
    const seconds =
        segments.length >= 3 ? Number.parseInt(segments[2], 10) : 0;

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))
        return null;

    return { hours, minutes, seconds };
};

const setRef = <T,>(ref: Ref<T> | undefined, node: T | null) => {
    if (typeof ref === "function") {
        ref(node);
    } else if (ref && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
    }
};

const inputSizes: Record<string, string> = {
    xs: "h-5 px-2 text-[8px]",
    sm: "h-6 px-2.5 text-[10px]",
    md: "h-8 px-3 text-xs",
    lg: "h-10 px-3.5 text-sm",
    xl: "h-12 px-4 text-base"
};

const inputVariants: Record<string, string> = {
    default:
        "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] border border-[var(--refraktor-border)]",
    filled: "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)]",
    outline:
        "bg-transparent text-[var(--refraktor-text)] border border-[var(--refraktor-border)]"
};

const segmentWidths: Record<string, string> = {
    xs: "w-[1.25rem]",
    sm: "w-[1.5rem]",
    md: "w-[1.75rem]",
    lg: "w-[2rem]",
    xl: "w-[2.5rem]"
};

const amPmWidths: Record<string, string> = {
    xs: "w-[1.75rem]",
    sm: "w-[2rem]",
    md: "w-[2.25rem]",
    lg: "w-[2.75rem]",
    xl: "w-[3.25rem]"
};

const separatorSizes: Record<string, string> = {
    xs: "text-[8px]",
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base"
};

const TimePicker = factory<TimePickerFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        value,
        defaultValue,
        onChange,
        format,
        withSeconds,
        withDropdown,
        clearable,
        min,
        max,
        hoursStep,
        minutesStep,
        secondsStep,
        amPmLabels,
        disabled,
        readOnly,
        variant,
        size,
        radius,
        label,
        description,
        error,
        required,
        withAsterisk,
        leftSection,
        rightSection,
        hoursRef: hoursRefProp,
        minutesRef: minutesRefProp,
        secondsRef: secondsRefProp,
        amPmRef: amPmRefProp,
        hoursInputLabel,
        minutesInputLabel,
        secondsInputLabel,
        amPmInputLabel,
        popoverProps,
        strategy,
        onFocus,
        onBlur,
        className,
        classNames,
        ...props
    } = useProps("TimePicker", defaultProps, _props);
    const classes = useClassNames("TimePicker", classNames);

    const _id = useId(id);
    const is12h = format === "12h";

    const hoursRef = useRef<HTMLInputElement>(null);
    const minutesRef = useRef<HTMLInputElement>(null);
    const secondsRef = useRef<HTMLInputElement>(null);
    const amPmRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const minParsed = useMemo(() => parseMinMax(min), [min]);
    const maxParsed = useMemo(() => parseMinMax(max), [max]);

    const [internalValue, setInternalValue] = useUncontrolled<string>({
        value,
        defaultValue,
        finalValue: "",
        onChange
    });

    const [parts, setParts] = useState<TimeParts>(() =>
        parseValue(internalValue, withSeconds)
    );

    useEffect(() => {
        const parsed = parseValue(internalValue, withSeconds);
        setParts(parsed);
    }, [internalValue, withSeconds]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isDropdownVisible = withDropdown && dropdownOpen && !disabled;

    const floating = useFloating({
        placement: popoverProps?.placement ?? "bottom-start",
        open: isDropdownVisible,
        onOpenChange: (open) => {
            if (!disabled && !readOnly) setDropdownOpen(open);
        },
        middleware: [
            offset(popoverProps?.offset ?? 4),
            flip(),
            shift()
        ],
        whileElementsMounted: autoUpdate,
        strategy
    });

    const click = useClick(floating.context, {
        enabled: withDropdown && !disabled && !readOnly
    });
    const dismiss = useDismiss(floating.context);
    const role = useRole(floating.context, { role: "dialog" });
    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role
    ]);

    const emitValue = useCallback(
        (nextParts: TimeParts) => {
            const allFilled =
                nextParts.hours !== null &&
                nextParts.minutes !== null &&
                (!withSeconds || nextParts.seconds !== null) &&
                (!is12h || nextParts.amPm !== null);

            const allEmpty =
                nextParts.hours === null &&
                nextParts.minutes === null &&
                (nextParts.seconds === null || !withSeconds);

            if (allFilled) {
                let hours = nextParts.hours!;
                if (is12h && nextParts.amPm !== null) {
                    hours = to24Hour(hours, nextParts.amPm);
                }
                const formatted = formatValue(
                    { ...nextParts, hours },
                    withSeconds
                );
                setInternalValue(formatted);
            } else if (allEmpty) {
                setInternalValue("");
            }
        },
        [is12h, setInternalValue, withSeconds]
    );

    const updateParts = useCallback(
        (updater: (prev: TimeParts) => TimeParts) => {
            setParts((prev) => {
                const next = updater(prev);
                emitValue(next);
                return next;
            });
        },
        [emitValue]
    );

    const getDisplayHours = useCallback(
        (hours24: number | null): string => {
            if (hours24 === null) return PLACEHOLDER;
            if (is12h) return pad(to12Hour(hours24));
            return pad(hours24);
        },
        [is12h]
    );

    const handleClear = useCallback(() => {
        if (disabled || readOnly) return;
        const empty: TimeParts = {
            hours: null,
            minutes: null,
            seconds: null,
            amPm: null
        };
        setParts(empty);
        setInternalValue("");
        hoursRef.current?.focus();
    }, [disabled, readOnly, setInternalValue]);

    const createSegmentKeyHandler = useCallback(
        (
            segment: "hours" | "minutes" | "seconds",
            prevRef: React.RefObject<HTMLInputElement | null>,
            nextRef: React.RefObject<HTMLInputElement | null>
        ) => {
            return (event: KeyboardEvent<HTMLInputElement>) => {
                if (disabled || readOnly) return;

                const step =
                    segment === "hours"
                        ? hoursStep
                        : segment === "minutes"
                          ? minutesStep
                          : secondsStep;
                const maxVal =
                    segment === "hours"
                        ? is12h
                            ? 12
                            : HOURS_IN_DAY - 1
                        : segment === "minutes"
                          ? MINUTES_IN_HOUR - 1
                          : SECONDS_IN_MINUTE - 1;
                const minVal = segment === "hours" && is12h ? 1 : 0;

                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    updateParts((prev) => {
                        const current = prev[segment] ?? minVal;
                        let next = current + step;
                        if (next > maxVal) next = minVal;
                        return { ...prev, [segment]: next };
                    });
                    return;
                }

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    updateParts((prev) => {
                        const current = prev[segment] ?? maxVal;
                        let next = current - step;
                        if (next < minVal) next = maxVal;
                        return { ...prev, [segment]: next };
                    });
                    return;
                }

                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    nextRef.current?.focus();
                    nextRef.current?.select();
                    return;
                }

                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    prevRef.current?.focus();
                    prevRef.current?.select();
                    return;
                }

                if (event.key === "Home") {
                    event.preventDefault();
                    updateParts((prev) => ({ ...prev, [segment]: minVal }));
                    return;
                }

                if (event.key === "End") {
                    event.preventDefault();
                    updateParts((prev) => ({ ...prev, [segment]: maxVal }));
                    return;
                }

                if (event.key === "Backspace") {
                    event.preventDefault();
                    updateParts((prev) => {
                        if (prev[segment] === null) {
                            prevRef.current?.focus();
                            prevRef.current?.select();
                            return prev;
                        }
                        return { ...prev, [segment]: null };
                    });
                    return;
                }

                if (event.key === "Tab") {
                    return;
                }

                if (/^\d$/.test(event.key)) {
                    event.preventDefault();
                    const digit = Number.parseInt(event.key, 10);
                    updateParts((prev) => {
                        const current = prev[segment];
                        let next: number;

                        if (current === null || current >= 10) {
                            next = digit;
                        } else {
                            next = current * 10 + digit;
                        }

                        if (next > maxVal) {
                            next = digit;
                        }

                        const result = { ...prev, [segment]: next };

                        if (next >= (maxVal + 1) / 10 || (current !== null && current < 10)) {
                            requestAnimationFrame(() => {
                                nextRef.current?.focus();
                                nextRef.current?.select();
                            });
                        }

                        return result;
                    });
                    return;
                }

                if (!event.ctrlKey && !event.metaKey && !event.altKey) {
                    event.preventDefault();
                }
            };
        },
        [disabled, hoursStep, is12h, minutesStep, readOnly, secondsStep, updateParts]
    );

    const handleAmPmKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (disabled || readOnly) return;

            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                updateParts((prev) => ({
                    ...prev,
                    amPm: prev.amPm === "AM" ? "PM" : "AM"
                }));
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                const prev = withSeconds ? secondsRef : minutesRef;
                prev.current?.focus();
                prev.current?.select();
                return;
            }

            if (
                event.key.toLowerCase() === "a" ||
                event.key.toLowerCase() === "p"
            ) {
                event.preventDefault();
                const nextAmPm = event.key.toLowerCase() === "a" ? "AM" : "PM";
                updateParts((prev) => ({ ...prev, amPm: nextAmPm }));
                return;
            }

            if (event.key === "Backspace") {
                event.preventDefault();
                updateParts((prev) => {
                    if (prev.amPm === null) {
                        const prev2 = withSeconds ? secondsRef : minutesRef;
                        prev2.current?.focus();
                        prev2.current?.select();
                        return prev;
                    }
                    return { ...prev, amPm: null };
                });
                return;
            }

            if (event.key === "Tab") {
                return;
            }

            if (!event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
            }
        },
        [disabled, readOnly, updateParts, withSeconds]
    );

    const handleWrapperFocus = useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
            if (blurTimeoutRef.current !== null) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
            }

            if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
                onFocus?.(event);
                if (withDropdown && !disabled && !readOnly) {
                    setDropdownOpen(true);
                }
            }
        },
        [disabled, onFocus, readOnly, withDropdown]
    );

    const handleWrapperBlur = useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
            blurTimeoutRef.current = setTimeout(() => {
                if (
                    !wrapperRef.current?.contains(document.activeElement) &&
                    !floating.refs.floating.current?.contains(
                        document.activeElement
                    )
                ) {
                    onBlur?.(event);
                    setDropdownOpen(false);
                }
            }, 0);
        },
        [floating.refs.floating, onBlur]
    );

    const displayHours = is12h
        ? parts.hours !== null
            ? pad(to12Hour(parts.hours))
            : PLACEHOLDER
        : parts.hours !== null
          ? pad(parts.hours)
          : PLACEHOLDER;
    const displayMinutes =
        parts.minutes !== null ? pad(parts.minutes) : PLACEHOLDER;
    const displaySeconds =
        parts.seconds !== null ? pad(parts.seconds) : PLACEHOLDER;
    const displayAmPm = parts.amPm ?? PLACEHOLDER;

    const hasValue =
        parts.hours !== null ||
        parts.minutes !== null ||
        (withSeconds && parts.seconds !== null);

    const showClearButton = clearable && hasValue && !disabled && !readOnly;

    const effectiveRightSection = showClearButton ? (
        <button
            type="button"
            tabIndex={-1}
            aria-label="Clear time"
            className={cx(
                "inline-flex items-center justify-center text-[var(--refraktor-text-secondary)] hover:text-[var(--refraktor-text)] transition-colors cursor-pointer"
            )}
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3.5"
            >
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
        </button>
    ) : (
        rightSection
    );

    const sizeClass = inputSizes[size] ?? inputSizes.md;
    const variantClass = inputVariants[variant] ?? inputVariants.default;
    const segmentWidth = segmentWidths[size] ?? segmentWidths.md;
    const amPmWidth = amPmWidths[size] ?? amPmWidths.md;
    const sepSize = separatorSizes[size] ?? separatorSizes.md;

    const hoursKeyHandler = createSegmentKeyHandler(
        "hours",
        { current: null },
        minutesRef
    );
    const minutesKeyHandler = createSegmentKeyHandler(
        "minutes",
        hoursRef,
        withSeconds ? secondsRef : is12h ? amPmRef : { current: null }
    );
    const secondsKeyHandler = createSegmentKeyHandler(
        "seconds",
        minutesRef,
        is12h ? amPmRef : { current: null }
    );

    const renderDropdown = () => {
        if (!withDropdown) return null;

        const sizeStyles = getPickerSizeStyles(size);
        const hoursCount = is12h ? 12 : HOURS_IN_DAY;
        const hoursStart = is12h ? 1 : 0;

        const hourOptions: number[] = [];
        for (let i = hoursStart; i < hoursStart + hoursCount; i += hoursStep) {
            hourOptions.push(i);
        }

        const minuteOptions: number[] = [];
        for (let i = 0; i < MINUTES_IN_HOUR; i += minutesStep) {
            minuteOptions.push(i);
        }

        const secondOptions: number[] = [];
        for (let i = 0; i < SECONDS_IN_MINUTE; i += secondsStep) {
            secondOptions.push(i);
        }

        const currentHourDisplay = is12h
            ? parts.hours !== null
                ? to12Hour(parts.hours)
                : null
            : parts.hours;

        const renderColumn = (
            columnLabel: string,
            options: (number | string)[],
            selectedValue: number | string | null,
            onSelect: (value: number | string) => void,
            extraClassName?: string
        ) => (
            <div
                className={cx(
                    "flex flex-col min-w-0",
                    classes.dropdownColumn,
                    extraClassName
                )}
            >
                <div
                    className={cx(
                        "py-1.5 text-center font-medium text-[var(--refraktor-text-secondary)] border-b border-[var(--refraktor-border)] bg-[var(--refraktor-bg-subtle)]",
                        sizeStyles.label,
                        classes.dropdownColumnLabel
                    )}
                >
                    {columnLabel}
                </div>
                <div
                    className={cx(
                        "refraktor-scrollbar flex max-h-52 flex-col gap-0.5 p-1 overflow-y-auto"
                    )}
                >
                    {options.map((opt) => {
                        const isSelected = opt === selectedValue;
                        const displayLabel =
                            typeof opt === "number" ? pad(opt) : opt;

                        return (
                            <button
                                key={String(opt)}
                                type="button"
                                tabIndex={-1}
                                className={cx(
                                    "inline-flex w-full items-center justify-center font-medium transition-colors",
                                    isSelected
                                        ? "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]"
                                        : "hover:bg-[var(--refraktor-bg-hover)] text-[var(--refraktor-text)]",
                                    sizeStyles.cell,
                                    getRadius(radius),
                                    classes.dropdownOption,
                                    isSelected && classes.dropdownOptionActive
                                )}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onSelect(opt)}
                            >
                                {displayLabel}
                            </button>
                        );
                    })}
                </div>
            </div>
        );

        const handleDropdownHourSelect = (val: number | string) => {
            const hourVal = typeof val === "number" ? val : Number(val);
            updateParts((prev) => {
                const next = { ...prev, hours: is12h ? to24Hour(hourVal, prev.amPm ?? "AM") : hourVal };
                if (next.minutes === null) {
                    requestAnimationFrame(() => {
                        minutesRef.current?.focus();
                        minutesRef.current?.select();
                    });
                }
                return next;
            });
        };

        const handleDropdownMinuteSelect = (val: number | string) => {
            const minVal = typeof val === "number" ? val : Number(val);
            updateParts((prev) => {
                const next = { ...prev, minutes: minVal };
                if (withSeconds && next.seconds === null) {
                    requestAnimationFrame(() => {
                        secondsRef.current?.focus();
                        secondsRef.current?.select();
                    });
                }
                return next;
            });
        };

        const handleDropdownSecondSelect = (val: number | string) => {
            const secVal = typeof val === "number" ? val : Number(val);
            updateParts((prev) => ({ ...prev, seconds: secVal }));
        };

        const handleDropdownAmPmSelect = (val: number | string) => {
            const amPmVal = val as "AM" | "PM";
            updateParts((prev) => {
                if (prev.hours === null) return { ...prev, amPm: amPmVal };
                const hour12 = to12Hour(prev.hours);
                const newHours24 = to24Hour(hour12, amPmVal);
                return { ...prev, hours: newHours24, amPm: amPmVal };
            });
        };

        const columnCount =
            (withSeconds ? 4 : 3) + (is12h ? 1 : 0) - (withSeconds ? 0 : 1);
        const gridColsClass =
            columnCount === 2
                ? "grid-cols-2"
                : columnCount === 3
                  ? "grid-cols-3"
                  : "grid-cols-4";

        return (
            <FloatingPortal>
                {isDropdownVisible && (
                    <FloatingFocusManager
                        context={floating.context}
                        modal={false}
                        initialFocus={-1}
                        returnFocus={false}
                    >
                        <div
                            ref={floating.refs.setFloating}
                            style={{
                                ...floating.floatingStyles,
                                zIndex: 1000
                            }}
                            className={cx(
                                "border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] shadow-md overflow-hidden",
                                getRadius(radius),
                                classes.dropdown
                            )}
                            {...getFloatingProps()}
                        >
                            <div
                                className={cx(
                                    "grid divide-x divide-[var(--refraktor-border)]",
                                    gridColsClass
                                )}
                            >
                                {renderColumn(
                                    "Hour",
                                    hourOptions,
                                    currentHourDisplay,
                                    handleDropdownHourSelect
                                )}
                                {renderColumn(
                                    "Min",
                                    minuteOptions,
                                    parts.minutes,
                                    handleDropdownMinuteSelect
                                )}
                                {withSeconds &&
                                    renderColumn(
                                        "Sec",
                                        secondOptions,
                                        parts.seconds,
                                        handleDropdownSecondSelect
                                    )}
                                {is12h &&
                                    renderColumn(
                                        amPmLabels.am + "/" + amPmLabels.pm,
                                        [amPmLabels.am, amPmLabels.pm],
                                        parts.amPm ===
                                            "AM"
                                            ? amPmLabels.am
                                            : parts.amPm === "PM"
                                              ? amPmLabels.pm
                                              : null,
                                        (val) => {
                                            const normalized =
                                                val === amPmLabels.am
                                                    ? "AM"
                                                    : "PM";
                                            handleDropdownAmPmSelect(
                                                normalized
                                            );
                                        }
                                    )}
                            </div>
                        </div>
                    </FloatingFocusManager>
                )}
            </FloatingPortal>
        );
    };

    const hasWrapper = label || description || error;
    const inputContent = (
        <div
            ref={(node) => {
                if (wrapperRef) (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                floating.refs.setReference(node);
            }}
            className={cx(
                "relative w-full inline-flex items-center transition-all",
                sizeClass,
                variantClass,
                getRadius(radius),
                "focus-within:border-[var(--refraktor-primary)]",
                error && typeof error !== "boolean" && "border-[var(--refraktor-colors-red-6)]",
                disabled && "opacity-50 cursor-not-allowed",
                classes.fieldsWrapper,
                !hasWrapper && className
            )}
            onFocus={handleWrapperFocus}
            onBlur={handleWrapperBlur}
            {...(!hasWrapper ? getReferenceProps(props) : getReferenceProps())}
        >
            {leftSection && (
                <div className="flex h-full items-center justify-center text-[var(--refraktor-text-secondary)] shrink-0 select-none">
                    {leftSection}
                </div>
            )}

            <div
                className={cx(
                    "flex items-center flex-1 min-w-0 gap-0.5"
                )}
            >
                <input
                    ref={(node) => {
                        hoursRef.current = node;
                        setRef(hoursRefProp, node);
                    }}
                    id={`${_id}-hours`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={PLACEHOLDER}
                    value={
                        parts.hours !== null ? (is12h ? pad(to12Hour(parts.hours)) : pad(parts.hours)) : ""
                    }
                    aria-label={hoursInputLabel ?? "Hours"}
                    readOnly
                    tabIndex={disabled ? -1 : 0}
                    disabled={disabled}
                    className={cx(
                        "bg-transparent border-none outline-none text-center text-[var(--refraktor-text)] placeholder:text-[var(--refraktor-text-tertiary)] cursor-default select-all p-0",
                        segmentWidth,
                        classes.field
                    )}
                    onKeyDown={hoursKeyHandler}
                    onFocus={(e) => e.target.select()}
                />

                <span
                    className={cx(
                        "text-[var(--refraktor-text-secondary)] select-none leading-none",
                        sepSize,
                        classes.separator
                    )}
                >
                    :
                </span>

                <input
                    ref={(node) => {
                        minutesRef.current = node;
                        setRef(minutesRefProp, node);
                    }}
                    id={`${_id}-minutes`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={PLACEHOLDER}
                    value={
                        parts.minutes !== null ? pad(parts.minutes) : ""
                    }
                    aria-label={minutesInputLabel ?? "Minutes"}
                    readOnly
                    tabIndex={disabled ? -1 : 0}
                    disabled={disabled}
                    className={cx(
                        "bg-transparent border-none outline-none text-center text-[var(--refraktor-text)] placeholder:text-[var(--refraktor-text-tertiary)] cursor-default select-all p-0",
                        segmentWidth,
                        classes.field
                    )}
                    onKeyDown={minutesKeyHandler}
                    onFocus={(e) => e.target.select()}
                />

                {withSeconds && (
                    <>
                        <span
                            className={cx(
                                "text-[var(--refraktor-text-secondary)] select-none leading-none",
                                sepSize,
                                classes.separator
                            )}
                        >
                            :
                        </span>
                        <input
                            ref={(node) => {
                                secondsRef.current = node;
                                setRef(secondsRefProp, node);
                            }}
                            id={`${_id}-seconds`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder={PLACEHOLDER}
                            value={
                                parts.seconds !== null
                                    ? pad(parts.seconds)
                                    : ""
                            }
                            aria-label={secondsInputLabel ?? "Seconds"}
                            readOnly
                            tabIndex={disabled ? -1 : 0}
                            disabled={disabled}
                            className={cx(
                                "bg-transparent border-none outline-none text-center text-[var(--refraktor-text)] placeholder:text-[var(--refraktor-text-tertiary)] cursor-default select-all p-0",
                                segmentWidth,
                                classes.field
                            )}
                            onKeyDown={secondsKeyHandler}
                            onFocus={(e) => e.target.select()}
                        />
                    </>
                )}

                {is12h && (
                    <input
                        ref={(node) => {
                            amPmRef.current = node;
                            setRef(amPmRefProp, node);
                        }}
                        id={`${_id}-ampm`}
                        type="text"
                        autoComplete="off"
                        placeholder={PLACEHOLDER}
                        value={
                            parts.amPm !== null
                                ? parts.amPm === "AM"
                                    ? amPmLabels.am
                                    : amPmLabels.pm
                                : ""
                        }
                        aria-label={amPmInputLabel ?? "AM/PM"}
                        readOnly
                        tabIndex={disabled ? -1 : 0}
                        disabled={disabled}
                        className={cx(
                            "bg-transparent border-none outline-none text-center text-[var(--refraktor-text)] placeholder:text-[var(--refraktor-text-tertiary)] cursor-default select-all p-0 ml-1",
                            amPmWidth,
                            classes.amPmInput
                        )}
                        onKeyDown={handleAmPmKeyDown}
                        onFocus={(e) => e.target.select()}
                    />
                )}
            </div>

            {effectiveRightSection && (
                <div className="flex h-full items-center justify-center text-[var(--refraktor-text-secondary)] shrink-0 select-none">
                    {effectiveRightSection}
                </div>
            )}
        </div>
    );

    const content = hasWrapper ? (
        <Input.Wrapper
            ref={ref}
            label={label}
            description={description}
            error={error}
            required={required}
            withAsterisk={withAsterisk}
            inputId={`${_id}-hours`}
            className={cx(classes.root, className)}
        >
            {inputContent}
            {renderDropdown()}
        </Input.Wrapper>
    ) : (
        <div
            ref={ref}
            className={cx(classes.root, className)}
        >
            {inputContent}
            {renderDropdown()}
        </div>
    );

    return content;
});

TimePicker.displayName = "@refraktor/dates/TimePicker";
TimePicker.configure = createComponentConfig<TimePickerProps>();
TimePicker.classNames = createClassNamesConfig<TimePickerClassNames>();

export default TimePicker;
