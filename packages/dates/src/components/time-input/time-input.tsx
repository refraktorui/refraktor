import { useId, useUncontrolled } from "@refraktor/utils";
import { useCallback, useMemo } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    Input,
    Transition,
    useClassNames,
    useProps,
    useTheme
} from "@refraktor/core";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingPortal,
    inline,
    Middleware,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { useDates } from "../dates-provider";
import { TimePicker } from "../time-picker";
import {
    TimeInputClassNames,
    TimeInputFactoryPayload,
    TimeInputMode,
    TimeInputProps,
    TimeInputValue
} from "./time-input.types";

const DEFAULT_MODE: TimeInputMode = "24h";
const DEFAULT_VALUE_FORMAT = "HH:mm:ss";
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const TIME_SEGMENT_PATTERN = /^\d{1,2}$/;

const defaultProps = {
    mode: DEFAULT_MODE,
    valueFormat: DEFAULT_VALUE_FORMAT,
    disabled: false,
    size: "md",
    radius: "default",
    positioning: {
        placement: "bottom-start",
        offset: 4
    },
    middlewares: {
        flip: true,
        shift: true
    },
    withinPortal: true,
    closeOnClickOutside: true,
    closeOnEscape: true
} satisfies Partial<TimeInputProps>;

type TimeParts = {
    hours24: number;
    minutes: number;
    seconds: number;
};

const pad = (value: number) => String(value).padStart(2, "0");

const parseTimeValue = (value: unknown): TimeParts | undefined => {
    if (typeof value !== "string") {
        return undefined;
    }

    const segments = value.trim().split(":");

    if (
        segments.length !== 3 ||
        !segments.every((segment) => TIME_SEGMENT_PATTERN.test(segment))
    ) {
        return undefined;
    }

    const [hoursText, minutesText, secondsText] = segments;
    const hours24 = Number.parseInt(hoursText, 10);
    const minutes = Number.parseInt(minutesText, 10);
    const seconds = Number.parseInt(secondsText, 10);

    if (
        hours24 < 0 ||
        hours24 >= HOURS_IN_DAY ||
        minutes < 0 ||
        minutes >= MINUTES_IN_HOUR ||
        seconds < 0 ||
        seconds >= SECONDS_IN_MINUTE
    ) {
        return undefined;
    }

    return {
        hours24,
        minutes,
        seconds
    };
};

const normalizeTimeValue = (value: TimeInputValue | undefined) => {
    const parsed = parseTimeValue(value);

    if (!parsed) {
        return undefined;
    }

    return `${pad(parsed.hours24)}:${pad(parsed.minutes)}:${pad(parsed.seconds)}`;
};

const formatInputValue = (
    value: TimeInputValue | undefined,
    valueFormat: string,
    createDate: ReturnType<typeof useDates>["createDate"]
) => {
    if (value === undefined) {
        return "";
    }

    if (valueFormat === DEFAULT_VALUE_FORMAT) {
        return value;
    }

    const parsed = parseTimeValue(value);

    if (!parsed) {
        return value;
    }

    return createDate(
        new Date(2000, 0, 1, parsed.hours24, parsed.minutes, parsed.seconds, 0)
    ).format(valueFormat);
};

const TimeInput = factory<TimeInputFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const { createDate } = useDates();
    const {
        id,
        value,
        defaultValue,
        onChange,
        opened,
        defaultOpened,
        onOpenedChange,
        minTime,
        maxTime,
        mode,
        getHourLabel,
        getMinuteLabel,
        getSecondLabel,
        getPeriodLabel,
        getHourAriaLabel,
        getMinuteAriaLabel,
        getSecondAriaLabel,
        getPeriodAriaLabel,
        valueFormat,
        disabled,
        size,
        radius,
        positioning,
        middlewares,
        withinPortal,
        closeOnClickOutside,
        closeOnEscape,
        transitionProps,
        inputClassNames,
        className,
        classNames,
        onFocus,
        onBlur,
        onClick,
        onKeyDown,
        ...inputProps
    } = useProps("TimeInput", defaultProps, _props);
    const classes = useClassNames("TimeInput", classNames);

    const _id = useId(id);
    const dropdownId = `${_id}-dropdown`;

    const [selectedTimeState, setSelectedTime] = useUncontrolled<
        TimeInputValue | undefined
    >({
        value,
        defaultValue,
        finalValue: undefined,
        onChange: (nextTime) => {
            if (nextTime !== undefined) {
                onChange?.(nextTime);
            }
        }
    });

    const [isOpenState, setIsOpen] = useUncontrolled<boolean>({
        value: opened,
        defaultValue: defaultOpened,
        finalValue: false,
        onChange: onOpenedChange
    });

    const isOpen = isOpenState && !disabled;

    const middleware = useMemo(() => {
        const middlewareList: Middleware[] = [];

        middlewareList.push(offset(positioning?.offset ?? 4));

        if (middlewares?.flip ?? true) {
            middlewareList.push(
                flip(
                    typeof middlewares?.flip === "boolean"
                        ? undefined
                        : middlewares.flip
                )
            );
        }

        if (middlewares?.shift ?? true) {
            middlewareList.push(
                shift(
                    typeof middlewares?.shift === "boolean"
                        ? undefined
                        : middlewares.shift
                )
            );
        }

        if (middlewares?.inline) {
            middlewareList.push(
                inline(
                    typeof middlewares.inline === "boolean"
                        ? undefined
                        : middlewares.inline
                )
            );
        }

        return middlewareList;
    }, [middlewares, positioning?.offset]);

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (disabled && nextOpen) {
                return;
            }

            setIsOpen(nextOpen);
        },
        [disabled, setIsOpen]
    );

    const floating = useFloating({
        placement: positioning?.placement ?? "bottom-start",
        open: isOpen,
        onOpenChange: handleOpenChange,
        middleware,
        whileElementsMounted: autoUpdate,
        strategy: "fixed"
    });

    const focus = useFocus(floating.context, {
        enabled: !disabled
    });

    const dismiss = useDismiss(floating.context, {
        outsidePress: closeOnClickOutside,
        escapeKey: closeOnEscape
    });

    const role = useRole(floating.context, {
        role: "dialog"
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        focus,
        dismiss,
        role
    ]);

    const setInputRef = useCallback(
        (node: HTMLInputElement | null) => {
            floating.refs.setReference(node);

            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        [floating.refs, ref]
    );

    const handleInputKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(event);

            if (event.defaultPrevented || disabled) {
                return;
            }

            if (
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                setIsOpen(true);
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                setIsOpen(false);
            }
        },
        [disabled, onKeyDown, setIsOpen]
    );

    const handleTimeChange = useCallback(
        (nextTime: TimeInputValue) => {
            const normalizedTime = normalizeTimeValue(nextTime);

            if (normalizedTime === undefined) {
                return;
            }

            setSelectedTime(normalizedTime);
        },
        [setSelectedTime]
    );

    const selectedTime = useMemo(
        () => normalizeTimeValue(selectedTimeState),
        [selectedTimeState]
    );
    const inputValue = useMemo(
        () => formatInputValue(selectedTime, valueFormat, createDate),
        [createDate, selectedTime, valueFormat]
    );

    const mergedReferenceProps = getReferenceProps({
        onFocus,
        onBlur,
        onClick,
        onKeyDown: handleInputKeyDown
    });

    const dropdownWidth =
        mode === "12h"
            ? "w-[calc(100vw-1rem)] max-w-[28rem]"
            : "w-[calc(100vw-1rem)] max-w-[22rem]";

    const dropdownContent = (
        <Transition
            transition="fade"
            duration={150}
            mounted={isOpen}
            style={{ position: "relative", zIndex: 1000 }}
            {...transitionProps}
        >
            <div
                ref={floating.refs.setFloating}
                id={dropdownId}
                style={{
                    ...floating.floatingStyles,
                    zIndex: 1000
                }}
                className={cx(
                    dropdownWidth,
                    "z-50 border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] p-2 text-[var(--refraktor-text)] shadow-md",
                    getRadius(radius),
                    classes.dropdown
                )}
                {...getFloatingProps()}
            >
                <TimePicker
                    value={selectedTime}
                    onChange={handleTimeChange}
                    minTime={minTime}
                    maxTime={maxTime}
                    mode={mode}
                    disabled={disabled}
                    size={size}
                    radius={radius}
                    getHourLabel={getHourLabel}
                    getMinuteLabel={getMinuteLabel}
                    getSecondLabel={getSecondLabel}
                    getPeriodLabel={getPeriodLabel}
                    getHourAriaLabel={getHourAriaLabel}
                    getMinuteAriaLabel={getMinuteAriaLabel}
                    getSecondAriaLabel={getSecondAriaLabel}
                    getPeriodAriaLabel={getPeriodAriaLabel}
                    className={cx("bg-transparent p-0", classes.timePicker)}
                />
            </div>
        </Transition>
    );

    const wrappedContent = isOpen ? (
        <FloatingFocusManager
            context={floating.context}
            modal={false}
            initialFocus={-1}
            returnFocus={false}
        >
            {dropdownContent}
        </FloatingFocusManager>
    ) : (
        dropdownContent
    );

    return (
        <>
            <Input
                ref={setInputRef}
                id={_id}
                readOnly
                value={inputValue}
                disabled={disabled}
                size={size}
                radius={radius}
                role="combobox"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={isOpen ? dropdownId : undefined}
                className={cx(classes.input, className)}
                classNames={inputClassNames}
                {...inputProps}
                {...(mergedReferenceProps as any)}
            />

            {withinPortal ? (
                <FloatingPortal>{wrappedContent}</FloatingPortal>
            ) : (
                wrappedContent
            )}
        </>
    );
});

TimeInput.displayName = "@refraktor/dates/TimeInput";
TimeInput.configure = createComponentConfig<TimeInputProps>();
TimeInput.classNames = createClassNamesConfig<TimeInputClassNames>();

export default TimeInput;
