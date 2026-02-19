import { useId, useUncontrolled } from "@refraktor/utils";
import { KeyboardEvent, ReactNode, useMemo } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps,
    useTheme
} from "@refraktor/core";
import { getGridColumns, getPickerSizeStyles } from "../picker-shared";
import {
    TimePickerClassNames,
    TimePickerFactoryPayload,
    TimePickerMode,
    TimePickerPeriod,
    TimePickerProps,
    TimePickerValue
} from "./time-picker.types";

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
const DEFAULT_MODE: TimePickerMode = "24h";
const TIME_SEGMENT_PATTERN = /^\d{1,2}$/;

const defaultProps = {
    mode: DEFAULT_MODE,
    disabled: false,
    size: "md",
    radius: "default"
} satisfies Partial<TimePickerProps>;

type TimeBounds = {
    minSeconds: number;
    maxSeconds: number;
    hasMin: boolean;
    hasMax: boolean;
};

type TimeParts = {
    hours24: number;
    hour12: number;
    minutes: number;
    seconds: number;
    period: TimePickerPeriod;
};

type PickerOptionValue = number | TimePickerPeriod;

type PickerOption<TValue extends PickerOptionValue = PickerOptionValue> = {
    value: TValue;
    label: ReactNode;
    ariaLabel: string;
    selected: boolean;
    disabled: boolean;
};

const pad = (value: number) => String(value).padStart(2, "0");

const to12Hour = (hours24: number) => {
    const normalized = hours24 % 12;
    return normalized === 0 ? 12 : normalized;
};

const to24Hour = (hour12: number, period: TimePickerPeriod) => {
    const normalizedHour = hour12 % 12;
    return period === "pm" ? normalizedHour + 12 : normalizedHour;
};

const toSecondsOfDay = (hours24: number, minutes: number, seconds: number) =>
    hours24 * MINUTES_IN_HOUR * SECONDS_IN_MINUTE + minutes * SECONDS_IN_MINUTE + seconds;

const createTimeParts = (hours24: number, minutes: number, seconds: number): TimeParts => {
    const normalizedHours24 = hours24 % HOURS_IN_DAY;

    return {
        hours24: normalizedHours24,
        hour12: to12Hour(normalizedHours24),
        minutes,
        seconds,
        period: normalizedHours24 >= 12 ? "pm" : "am"
    };
};

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

    return createTimeParts(hours24, minutes, seconds);
};

const formatTimeValue = (hours24: number, minutes: number, seconds: number) =>
    `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;

const toTimePartsFromSeconds = (seconds: number) => {
    const normalizedSeconds =
        ((seconds % SECONDS_IN_DAY) + SECONDS_IN_DAY) % SECONDS_IN_DAY;
    const hours24 = Math.floor(
        normalizedSeconds / (MINUTES_IN_HOUR * SECONDS_IN_MINUTE)
    );
    const minutes = Math.floor(
        (normalizedSeconds % (MINUTES_IN_HOUR * SECONDS_IN_MINUTE)) /
            SECONDS_IN_MINUTE
    );
    const remainingSeconds = normalizedSeconds % SECONDS_IN_MINUTE;

    return createTimeParts(hours24, minutes, remainingSeconds);
};

const clampTimeParts = (parts: TimeParts, bounds: TimeBounds) => {
    const seconds = toSecondsOfDay(parts.hours24, parts.minutes, parts.seconds);

    if (bounds.hasMin && seconds < bounds.minSeconds) {
        return toTimePartsFromSeconds(bounds.minSeconds);
    }

    if (bounds.hasMax && seconds > bounds.maxSeconds) {
        return toTimePartsFromSeconds(bounds.maxSeconds);
    }

    return parts;
};

const getCurrentTimeParts = () => {
    const current = new Date();
    return createTimeParts(
        current.getHours(),
        current.getMinutes(),
        current.getSeconds()
    );
};

const getTimeBounds = (
    minTime?: TimePickerValue,
    maxTime?: TimePickerValue
): TimeBounds => {
    const minParts = parseTimeValue(minTime);
    const maxParts = parseTimeValue(maxTime);
    const hasMin = minParts !== undefined;
    const hasMax = maxParts !== undefined;

    const minSeconds = hasMin
        ? toSecondsOfDay(minParts.hours24, minParts.minutes, minParts.seconds)
        : Number.NEGATIVE_INFINITY;
    const maxSeconds = hasMax
        ? toSecondsOfDay(maxParts.hours24, maxParts.minutes, maxParts.seconds)
        : Number.POSITIVE_INFINITY;

    if (hasMin && hasMax && minSeconds > maxSeconds) {
        return {
            minSeconds: maxSeconds,
            maxSeconds: minSeconds,
            hasMin: true,
            hasMax: true
        };
    }

    return {
        minSeconds,
        maxSeconds,
        hasMin,
        hasMax
    };
};

const isTimeDisabled = (seconds: number, disabled: boolean, bounds: TimeBounds) =>
    disabled ||
    (bounds.hasMin && seconds < bounds.minSeconds) ||
    (bounds.hasMax && seconds > bounds.maxSeconds);

const getSelectablePeriodRange = (
    period: TimePickerPeriod,
    bounds: TimeBounds
) => {
    const periodStart = period === "am" ? 0 : SECONDS_IN_DAY / 2;
    const periodEnd = period === "am" ? SECONDS_IN_DAY / 2 - 1 : SECONDS_IN_DAY - 1;

    const start = Math.max(periodStart, bounds.minSeconds);
    const end = Math.min(periodEnd, bounds.maxSeconds);

    if (start > end) {
        return undefined;
    }

    return { start, end };
};

const getFirstEnabledIndex = <TValue extends PickerOptionValue>(
    options: PickerOption<TValue>[]
) => options.findIndex((option) => !option.disabled);

const getLastEnabledIndex = <TValue extends PickerOptionValue>(
    options: PickerOption<TValue>[]
) => {
    for (let index = options.length - 1; index >= 0; index -= 1) {
        if (!options[index].disabled) {
            return index;
        }
    }

    return -1;
};

const findNextEnabledIndex = <TValue extends PickerOptionValue>(
    options: PickerOption<TValue>[],
    startIndex: number,
    direction: 1 | -1
) => {
    let index = startIndex + direction;

    while (index >= 0 && index < options.length) {
        if (!options[index].disabled) {
            return index;
        }

        index += direction;
    }

    return startIndex;
};

const handleListKeyDown = <TValue extends PickerOptionValue>(
    event: KeyboardEvent<HTMLDivElement>,
    options: PickerOption<TValue>[],
    onSelect: (value: TValue) => void
) => {
    const firstEnabledIndex = getFirstEnabledIndex(options);
    const lastEnabledIndex = getLastEnabledIndex(options);

    if (firstEnabledIndex === -1 || lastEnabledIndex === -1) {
        return;
    }

    const selectedIndex = options.findIndex((option) => option.selected);

    if (event.key === "Home") {
        event.preventDefault();
        onSelect(options[firstEnabledIndex].value);
        return;
    }

    if (event.key === "End") {
        event.preventDefault();
        onSelect(options[lastEnabledIndex].value);
        return;
    }

    const applyStep = (direction: 1 | -1, repeat = 1) => {
        event.preventDefault();

        let index =
            selectedIndex === -1
                ? direction === 1
                    ? firstEnabledIndex
                    : lastEnabledIndex
                : selectedIndex;

        for (let step = 0; step < repeat; step += 1) {
            const nextIndex = findNextEnabledIndex(options, index, direction);

            if (nextIndex === index) {
                break;
            }

            index = nextIndex;
        }

        onSelect(options[index].value);
    };

    if (event.key === "ArrowDown") {
        applyStep(1);
        return;
    }

    if (event.key === "ArrowUp") {
        applyStep(-1);
        return;
    }

    if (event.key === "PageDown") {
        applyStep(1, 5);
        return;
    }

    if (event.key === "PageUp") {
        applyStep(-1, 5);
    }
};

const TimePicker = factory<TimePickerFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        value,
        defaultValue,
        onChange,
        minTime,
        maxTime,
        mode,
        disabled,
        size,
        radius,
        getHourLabel,
        getMinuteLabel,
        getSecondLabel,
        getPeriodLabel,
        getHourAriaLabel,
        getMinuteAriaLabel,
        getSecondAriaLabel,
        getPeriodAriaLabel,
        className,
        classNames,
        ...props
    } = useProps("TimePicker", defaultProps, _props);
    const classes = useClassNames("TimePicker", classNames);

    const _id = useId(id);
    const sizeStyles = getPickerSizeStyles(size);

    const bounds = useMemo(() => getTimeBounds(minTime, maxTime), [minTime, maxTime]);

    const [selectedTimeState, setSelectedTime] = useUncontrolled<
        TimePickerValue | undefined
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

    const selectedParts = useMemo(() => {
        const parsed = parseTimeValue(selectedTimeState);

        if (!parsed) {
            return undefined;
        }

        return clampTimeParts(parsed, bounds);
    }, [bounds, selectedTimeState]);
    const selectedTime = useMemo(
        () =>
            selectedParts
                ? formatTimeValue(
                      selectedParts.hours24,
                      selectedParts.minutes,
                      selectedParts.seconds
                  )
                : undefined,
        [selectedParts]
    );
    const fallbackParts = useMemo(
        () => clampTimeParts(getCurrentTimeParts(), bounds),
        [bounds]
    );
    const activeParts = selectedParts ?? fallbackParts;

    const applyTime = (hours24: number, minutes: number, seconds: number) => {
        if (disabled) {
            return;
        }

        const nextSeconds = toSecondsOfDay(hours24, minutes, seconds);

        if (isTimeDisabled(nextSeconds, false, bounds)) {
            return;
        }

        const nextTime = formatTimeValue(hours24, minutes, seconds);

        if (selectedTime === nextTime) {
            return;
        }

        setSelectedTime(nextTime);
    };

    const setHour = (hour: number) => {
        const nextHour = mode === "12h" ? to24Hour(hour, activeParts.period) : hour;
        applyTime(nextHour, activeParts.minutes, activeParts.seconds);
    };

    const setMinute = (minute: number) => {
        applyTime(activeParts.hours24, minute, activeParts.seconds);
    };

    const setSecond = (second: number) => {
        applyTime(activeParts.hours24, activeParts.minutes, second);
    };

    const setPeriod = (period: TimePickerPeriod) => {
        const selectableRange = getSelectablePeriodRange(period, bounds);

        if (!selectableRange) {
            return;
        }

        const nextHour24 = to24Hour(activeParts.hour12, period);
        const candidateSeconds = toSecondsOfDay(
            nextHour24,
            activeParts.minutes,
            activeParts.seconds
        );
        const nextSeconds = Math.min(
            selectableRange.end,
            Math.max(selectableRange.start, candidateSeconds)
        );
        const nextParts = toTimePartsFromSeconds(nextSeconds);

        applyTime(nextParts.hours24, nextParts.minutes, nextParts.seconds);
    };

    const hourOptions = useMemo<PickerOption<number>[]>(
        () => {
            const totalHours = mode === "12h" ? 12 : HOURS_IN_DAY;

            return Array.from({ length: totalHours }, (_, index) => {
                const hour = mode === "12h" ? index + 1 : index;
                const hours24 =
                    mode === "12h" ? to24Hour(hour, activeParts.period) : hour;
                const nextSeconds = toSecondsOfDay(
                    hours24,
                    activeParts.minutes,
                    activeParts.seconds
                );
                const selected =
                    selectedParts !== undefined &&
                    (mode === "12h"
                        ? selectedParts.hour12 === hour
                        : selectedParts.hours24 === hour);

                return {
                    value: hour,
                    label: getHourLabel ? getHourLabel(hour, mode) : pad(hour),
                    ariaLabel: getHourAriaLabel
                        ? getHourAriaLabel(hour, mode, selected)
                        : selected
                          ? `Hour ${pad(hour)}, selected`
                          : `Choose hour ${pad(hour)}`,
                    selected,
                    disabled: isTimeDisabled(nextSeconds, disabled ?? false, bounds)
                };
            });
        },
        [
            activeParts.minutes,
            activeParts.period,
            activeParts.seconds,
            bounds,
            disabled,
            getHourAriaLabel,
            getHourLabel,
            mode,
            selectedParts
        ]
    );

    const minuteOptions = useMemo<PickerOption<number>[]>(
        () =>
            Array.from({ length: MINUTES_IN_HOUR }, (_, minute) => {
                const nextSeconds = toSecondsOfDay(
                    activeParts.hours24,
                    minute,
                    activeParts.seconds
                );
                const selected = selectedParts?.minutes === minute;

                return {
                    value: minute,
                    label: getMinuteLabel ? getMinuteLabel(minute) : pad(minute),
                    ariaLabel: getMinuteAriaLabel
                        ? getMinuteAriaLabel(minute, selected)
                        : selected
                          ? `Minute ${pad(minute)}, selected`
                          : `Choose minute ${pad(minute)}`,
                    selected,
                    disabled: isTimeDisabled(nextSeconds, disabled ?? false, bounds)
                };
            }),
        [
            activeParts.hours24,
            activeParts.seconds,
            bounds,
            disabled,
            getMinuteAriaLabel,
            getMinuteLabel,
            selectedParts
        ]
    );

    const secondOptions = useMemo<PickerOption<number>[]>(
        () =>
            Array.from({ length: SECONDS_IN_MINUTE }, (_, second) => {
                const nextSeconds = toSecondsOfDay(
                    activeParts.hours24,
                    activeParts.minutes,
                    second
                );
                const selected = selectedParts?.seconds === second;

                return {
                    value: second,
                    label: getSecondLabel ? getSecondLabel(second) : pad(second),
                    ariaLabel: getSecondAriaLabel
                        ? getSecondAriaLabel(second, selected)
                        : selected
                          ? `Second ${pad(second)}, selected`
                          : `Choose second ${pad(second)}`,
                    selected,
                    disabled: isTimeDisabled(nextSeconds, disabled ?? false, bounds)
                };
            }),
        [
            activeParts.hours24,
            activeParts.minutes,
            bounds,
            disabled,
            getSecondAriaLabel,
            getSecondLabel,
            selectedParts
        ]
    );

    const periodOptions = useMemo<PickerOption<TimePickerPeriod>[]>(
        () =>
            (["am", "pm"] as const).map((period) => {
                const selected = selectedParts?.period === period;

                return {
                    value: period,
                    label: getPeriodLabel
                        ? getPeriodLabel(period)
                        : period.toUpperCase(),
                    ariaLabel: getPeriodAriaLabel
                        ? getPeriodAriaLabel(period, selected)
                        : selected
                          ? `${period.toUpperCase()}, selected`
                          : `Choose ${period.toUpperCase()}`,
                    selected,
                    disabled:
                        (disabled ?? false) ||
                        !getSelectablePeriodRange(period, bounds)
                };
            }),
        [
            bounds,
            disabled,
            getPeriodAriaLabel,
            getPeriodLabel,
            selectedParts
        ]
    );

    const renderSection = <TValue extends PickerOptionValue>({
        label,
        labelId,
        listLabel,
        options,
        onSelect,
        className
    }: {
        label: ReactNode;
        labelId: string;
        listLabel: string;
        options: PickerOption<TValue>[];
        onSelect: (value: TValue) => void;
        className?: string;
    }) => {
        const hasVisibleSelection = options.some((option) => option.selected);
        const firstEnabledIndex = getFirstEnabledIndex(options);

        return (
            <div
                role="group"
                aria-labelledby={labelId}
                className={cx("flex flex-col min-w-0", classes.section, className)}
            >
                <div
                    id={labelId}
                    className={cx(
                        "py-2 text-center font-medium text-[var(--refraktor-text-secondary)] border-b border-[var(--refraktor-border)] bg-[var(--refraktor-bg-subtle)]",
                        sizeStyles.label,
                        classes.sectionLabel
                    )}
                >
                    {label}
                </div>

                <div
                    role="listbox"
                    aria-label={listLabel}
                    className={cx(
                        "refraktor-scrollbar flex max-h-64 flex-col p-1 overflow-y-auto",
                        sizeStyles.gridGap,
                        classes.list
                    )}
                    onKeyDown={(event) => handleListKeyDown(event, options, onSelect)}
                >
                    {options.map((option, index) => {
                        const tabIndex =
                            option.selected ||
                            (!hasVisibleSelection && index === firstEnabledIndex)
                                ? 0
                                : -1;

                        return (
                            <button
                                key={`${labelId}-${String(option.value)}`}
                                type="button"
                                role="option"
                                aria-selected={option.selected}
                                aria-label={option.ariaLabel}
                                data-active={option.selected}
                                data-disabled={option.disabled}
                                disabled={option.disabled}
                                tabIndex={tabIndex}
                                className={cx(
                                    "inline-flex w-full items-center justify-center font-medium text-[var(--refraktor-text)] transition-colors",
                                    option.selected
                                        ? "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]"
                                        : "hover:bg-[var(--refraktor-bg-hover)]",
                                    option.disabled &&
                                        "pointer-events-none cursor-not-allowed opacity-50",
                                    sizeStyles.cell,
                                    getRadius(radius),
                                    classes.option,
                                    option.selected && classes.optionActive,
                                    option.disabled && classes.optionDisabled
                                )}
                                onClick={() => onSelect(option.value)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div
            ref={ref}
            id={_id}
            className={cx(
                "inline-flex w-full flex-col bg-[var(--refraktor-bg)] overflow-hidden border border-[var(--refraktor-border)]",
                getRadius(radius),
                classes.root,
                className
            )}
            {...props}
        >
            <div
                className={cx(
                    "grid divide-x divide-[var(--refraktor-border)]",
                    getGridColumns(mode === "12h" ? 4 : 3),
                    classes.grid
                )}
            >
                {renderSection({
                    label: "Hour",
                    labelId: `${_id}-hour-label`,
                    listLabel: "Hour options",
                    options: hourOptions,
                    onSelect: setHour,
                    className: classes.hourSection
                })}

                {renderSection({
                    label: "Minute",
                    labelId: `${_id}-minute-label`,
                    listLabel: "Minute options",
                    options: minuteOptions,
                    onSelect: setMinute,
                    className: classes.minuteSection
                })}

                {renderSection({
                    label: "Second",
                    labelId: `${_id}-second-label`,
                    listLabel: "Second options",
                    options: secondOptions,
                    onSelect: setSecond,
                    className: classes.secondSection
                })}

                {mode === "12h" &&
                    renderSection({
                        label: "Period",
                        labelId: `${_id}-period-label`,
                        listLabel: "AM or PM options",
                        options: periodOptions,
                        onSelect: setPeriod,
                        className: classes.periodSection
                    })}
            </div>
        </div>
    );
});

TimePicker.displayName = "@refraktor/dates/TimePicker";
TimePicker.configure = createComponentConfig<TimePickerProps>();
TimePicker.classNames = createClassNamesConfig<TimePickerClassNames>();

export default TimePicker;
