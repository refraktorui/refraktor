import { useId, useUncontrolled } from "@refraktor/utils";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useTheme,
    useClassNames,
    useProps
} from "@refraktor/core";
import {
    getGridColumns,
    getPickerSizeStyles,
    PickerHeader
} from "../picker-shared";
import { useDates } from "../dates-provider";
import { MonthPicker } from "../month-picker";
import {
    DatePickerClassNames,
    DatePickerFactoryPayload,
    DatePickerNavigationDirection,
    DatePickerProps
} from "./date-picker.types";

const DAYS_IN_WEEK = 7;
const CONSISTENT_WEEK_COUNT = 6;
const DEFAULT_MONTH_PICKER_COLUMNS = 3;
const DEFAULT_YEAR_PICKER_YEARS_PER_PAGE = 9;
const DEFAULT_YEAR_PICKER_COLUMNS = 3;

const defaultProps = {
    monthPickerColumns: DEFAULT_MONTH_PICKER_COLUMNS,
    yearPickerYearsPerPage: DEFAULT_YEAR_PICKER_YEARS_PER_PAGE,
    yearPickerColumns: DEFAULT_YEAR_PICKER_COLUMNS,
    disabled: false,
    size: "md",
    radius: "default"
} satisfies Partial<DatePickerProps>;

type DateBounds = {
    minDate: Date | undefined;
    maxDate: Date | undefined;
    minTimestamp: number;
    maxTimestamp: number;
    hasMin: boolean;
    hasMax: boolean;
};

type DatePickerView = "day" | "month";

const isValidDate = (value: unknown): value is Date =>
    value instanceof Date && !Number.isNaN(value.getTime());

const toSafeInteger = (value: number | undefined, fallback: number) => {
    if (!Number.isFinite(value)) {
        return fallback;
    }

    return Math.trunc(value as number);
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const startOfDay = (value: Date) => {
    const next = new Date(value);
    next.setHours(0, 0, 0, 0);
    return next;
};

const startOfMonth = (value: Date) => {
    const next = startOfDay(value);
    next.setDate(1);
    return next;
};

const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

const isSameMonth = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth();

const addDays = (value: Date, amount: number) => {
    const next = startOfDay(value);
    next.setDate(next.getDate() + amount);
    return next;
};

const addMonthsPreservingDay = (value: Date, amount: number) => {
    const originalDay = value.getDate();
    const next = startOfDay(value);
    next.setDate(1);
    next.setMonth(next.getMonth() + amount);

    const lastDayInTargetMonth = new Date(
        next.getFullYear(),
        next.getMonth() + 1,
        0
    ).getDate();

    next.setDate(Math.min(originalDay, lastDayInTargetMonth));
    return next;
};

const getDateBounds = (minDate?: Date, maxDate?: Date): DateBounds => {
    const normalizedMin = isValidDate(minDate) ? startOfDay(minDate) : undefined;
    const normalizedMax = isValidDate(maxDate) ? startOfDay(maxDate) : undefined;

    if (normalizedMin && normalizedMax && normalizedMin > normalizedMax) {
        return {
            minDate: normalizedMax,
            maxDate: normalizedMin,
            minTimestamp: normalizedMax.getTime(),
            maxTimestamp: normalizedMin.getTime(),
            hasMin: true,
            hasMax: true
        };
    }

    return {
        minDate: normalizedMin,
        maxDate: normalizedMax,
        minTimestamp: normalizedMin?.getTime() ?? Number.NEGATIVE_INFINITY,
        maxTimestamp: normalizedMax?.getTime() ?? Number.POSITIVE_INFINITY,
        hasMin: normalizedMin !== undefined,
        hasMax: normalizedMax !== undefined
    };
};

const clampDate = (value: Date, bounds: DateBounds) => {
    const normalizedValue = startOfDay(value);
    const timestamp = normalizedValue.getTime();

    if (timestamp < bounds.minTimestamp && bounds.minDate) {
        return bounds.minDate;
    }

    if (timestamp > bounds.maxTimestamp && bounds.maxDate) {
        return bounds.maxDate;
    }

    return normalizedValue;
};

const isDateDisabled = (value: Date, disabled: boolean, bounds: DateBounds) =>
    disabled ||
    value.getTime() < bounds.minTimestamp ||
    value.getTime() > bounds.maxTimestamp;

const toMonthIndex = (value: Date) => value.getFullYear() * 12 + value.getMonth();

const resolveMonthStart = (value: Date, bounds: DateBounds) =>
    startOfMonth(clampDate(value, bounds));

const getVisibleDays = (
    displayedMonth: Date,
    firstDayOfWeek: number,
    consistentWeeks: boolean
) => {
    const monthStart = startOfMonth(displayedMonth);
    const leadingDays =
        (monthStart.getDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
    const daysInMonth = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
    ).getDate();

    const visibleWithoutTrailing = leadingDays + daysInMonth;
    const trailingDays = consistentWeeks
        ? DAYS_IN_WEEK * CONSISTENT_WEEK_COUNT - visibleWithoutTrailing
        : (DAYS_IN_WEEK - (visibleWithoutTrailing % DAYS_IN_WEEK)) % DAYS_IN_WEEK;

    const totalDays = visibleWithoutTrailing + trailingDays;
    const firstVisibleDate = addDays(monthStart, -leadingDays);

    return Array.from({ length: totalDays }, (_, index) =>
        addDays(firstVisibleDate, index)
    );
};

const DatePicker = factory<DatePickerFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const { createDate, firstDayOfWeek, consistentWeeks, weekdays } = useDates();
    const {
        id,
        value,
        defaultValue,
        onChange,
        minDate,
        maxDate,
        monthPickerColumns,
        yearPickerYearsPerPage,
        yearPickerColumns,
        disabled,
        size,
        radius,
        getWeekdayLabel,
        getDayLabel,
        getDayAriaLabel,
        getHeaderLabel,
        getNavigationAriaLabel,
        getMonthLabel,
        getMonthAriaLabel,
        getMonthHeaderLabel,
        getMonthNavigationAriaLabel,
        className,
        classNames,
        ...props
    } = useProps("DatePicker", defaultProps, _props);
    const classes = useClassNames("DatePicker", classNames);

    const _id = useId(id);
    const today = useMemo(() => startOfDay(new Date()), []);
    const bounds = useMemo(() => getDateBounds(minDate, maxDate), [minDate, maxDate]);

    const safeMonthPickerColumns = clamp(
        toSafeInteger(monthPickerColumns, DEFAULT_MONTH_PICKER_COLUMNS),
        1,
        6
    );
    const safeYearPickerYearsPerPage = Math.max(
        1,
        toSafeInteger(
            yearPickerYearsPerPage,
            DEFAULT_YEAR_PICKER_YEARS_PER_PAGE
        )
    );
    const safeYearPickerColumns = clamp(
        toSafeInteger(yearPickerColumns, DEFAULT_YEAR_PICKER_COLUMNS),
        1,
        Math.min(6, safeYearPickerYearsPerPage)
    );

    const [selectedDateState, setSelectedDate] = useUncontrolled<
        Date | undefined
    >({
        value,
        defaultValue,
        finalValue: undefined,
        onChange: (nextDate) => {
            if (nextDate !== undefined) {
                onChange?.(nextDate);
            }
        }
    });

    const selectedDateTimestamp = isValidDate(selectedDateState)
        ? startOfDay(selectedDateState).getTime()
        : undefined;
    const selectedDate =
        selectedDateTimestamp !== undefined
            ? new Date(selectedDateTimestamp)
            : undefined;

    const [displayedMonth, setDisplayedMonth] = useState(() =>
        resolveMonthStart(selectedDate ?? today, bounds)
    );
    const [view, setView] = useState<DatePickerView>("day");

    useEffect(() => {
        setDisplayedMonth((previousMonth) =>
            resolveMonthStart(previousMonth, bounds)
        );
    }, [bounds]);

    useEffect(() => {
        if (selectedDate === undefined) {
            return;
        }

        const normalizedMonth = resolveMonthStart(selectedDate, bounds);

        setDisplayedMonth((previousMonth) => {
            if (isSameMonth(previousMonth, normalizedMonth)) {
                return previousMonth;
            }

            return normalizedMonth;
        });
    }, [bounds, selectedDateTimestamp]);

    const visibleDays = useMemo(
        () => getVisibleDays(displayedMonth, firstDayOfWeek, consistentWeeks),
        [consistentWeeks, displayedMonth, firstDayOfWeek]
    );

    const hasVisibleSelection =
        selectedDate !== undefined &&
        visibleDays.some((day) => isSameDay(day, selectedDate));

    const firstAvailableDay = useMemo(
        () =>
            visibleDays.find(
                (day) => !isDateDisabled(day, disabled ?? false, bounds)
            ),
        [bounds, disabled, visibleDays]
    );

    const canGoPrevious =
        !disabled &&
        (!bounds.hasMin ||
            (bounds.minDate !== undefined &&
                toMonthIndex(displayedMonth) > toMonthIndex(bounds.minDate)));
    const canGoNext =
        !disabled &&
        (!bounds.hasMax ||
            (bounds.maxDate !== undefined &&
                toMonthIndex(displayedMonth) < toMonthIndex(bounds.maxDate)));

    const sizeStyles = getPickerSizeStyles(size);

    const resolveNavigationLabel = (
        direction: DatePickerNavigationDirection
    ) => {
        if (getNavigationAriaLabel) {
            return getNavigationAriaLabel(direction, displayedMonth);
        }

        const nextVisibleMonth = addMonthsPreservingDay(
            displayedMonth,
            direction === "previous" ? -1 : 1
        );

        return direction === "previous"
            ? `Show previous month (${createDate(nextVisibleMonth).format("MMMM YYYY")})`
            : `Show next month (${createDate(nextVisibleMonth).format("MMMM YYYY")})`;
    };

    const resolveDayAriaLabel = (
        day: Date,
        isSelected: boolean,
        isOutside: boolean,
        isDisabled: boolean
    ) => {
        if (getDayAriaLabel) {
            return getDayAriaLabel(day, isSelected);
        }

        const dayLabel = createDate(day).format("dddd, MMMM D, YYYY");

        if (isSelected) {
            return `${dayLabel}, selected`;
        }

        const suffix = [
            isOutside ? "outside current month" : undefined,
            isDisabled ? "unavailable" : undefined
        ]
            .filter(Boolean)
            .join(", ");

        return suffix ? `Choose ${dayLabel}, ${suffix}` : `Choose ${dayLabel}`;
    };

    const setDay = (day: Date) => {
        const normalizedDay = startOfDay(day);

        if (isDateDisabled(normalizedDay, disabled ?? false, bounds)) {
            return;
        }

        if (selectedDate !== undefined && isSameDay(selectedDate, normalizedDay)) {
            return;
        }

        setDisplayedMonth(startOfMonth(normalizedDay));
        setSelectedDate(normalizedDay);
    };

    const shiftDisplayedMonth = (direction: -1 | 1) => {
        setDisplayedMonth((previousMonth) =>
            resolveMonthStart(
                addMonthsPreservingDay(previousMonth, direction),
                bounds
            )
        );
    };

    const handlePrevious = () => {
        if (!canGoPrevious) {
            return;
        }

        shiftDisplayedMonth(-1);
    };

    const handleNext = () => {
        if (!canGoNext) {
            return;
        }

        shiftDisplayedMonth(1);
    };

    const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        const keyboardBaseDay =
            selectedDate && visibleDays.some((day) => isSameDay(day, selectedDate))
                ? selectedDate
                : firstAvailableDay ?? clampDate(displayedMonth, bounds);

        const keyboardSteps: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -DAYS_IN_WEEK,
            ArrowDown: DAYS_IN_WEEK
        };

        const step = keyboardSteps[event.key];

        if (step !== undefined) {
            event.preventDefault();
            setDay(addDays(keyboardBaseDay, step));
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            setDay(startOfMonth(displayedMonth));
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            setDay(
                new Date(
                    displayedMonth.getFullYear(),
                    displayedMonth.getMonth() + 1,
                    0
                )
            );
            return;
        }

        if (event.key === "PageUp") {
            event.preventDefault();
            setDay(addMonthsPreservingDay(keyboardBaseDay, -1));
            return;
        }

        if (event.key === "PageDown") {
            event.preventDefault();
            setDay(addMonthsPreservingDay(keyboardBaseDay, 1));
        }
    };

    const handleHeaderLabelClick = () => {
        if (disabled) {
            return;
        }

        setView("month");
    };

    const handleMonthChange = (nextMonth: Date) => {
        if (disabled) {
            return;
        }

        setDisplayedMonth(resolveMonthStart(nextMonth, bounds));
        setView("day");
    };

    const monthViewMinYear = bounds.minDate?.getFullYear();
    const monthViewMaxYear = bounds.maxDate?.getFullYear();

    return (
        <div
            ref={ref}
            id={_id}
            className={cx(
                "inline-flex w-full flex-col gap-2 bg-[var(--refraktor-bg)] p-2",
                getRadius(radius),
                classes.root,
                className
            )}
            {...props}
        >
            {view === "month" ? (
                <MonthPicker
                    value={displayedMonth}
                    onChange={handleMonthChange}
                    minYear={monthViewMinYear}
                    maxYear={monthViewMaxYear}
                    columns={safeMonthPickerColumns}
                    yearPickerYearsPerPage={safeYearPickerYearsPerPage}
                    yearPickerColumns={safeYearPickerColumns}
                    disabled={disabled}
                    size={size}
                    radius={radius}
                    getMonthLabel={getMonthLabel}
                    getMonthAriaLabel={getMonthAriaLabel}
                    getHeaderLabel={getMonthHeaderLabel}
                    getNavigationAriaLabel={getMonthNavigationAriaLabel}
                    className={cx("bg-transparent p-0", classes.monthPicker)}
                />
            ) : (
                <>
                    <PickerHeader
                        label={
                            getHeaderLabel
                                ? getHeaderLabel(
                                      displayedMonth.getMonth(),
                                      displayedMonth.getFullYear(),
                                      displayedMonth
                                  )
                                : createDate(displayedMonth).format("MMMM YYYY")
                        }
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onLabelClick={
                            disabled ? undefined : handleHeaderLabelClick
                        }
                        previousDisabled={!canGoPrevious}
                        nextDisabled={!canGoNext}
                        previousLabel={resolveNavigationLabel("previous")}
                        nextLabel={resolveNavigationLabel("next")}
                        size={size}
                        radius={radius}
                        classNames={{
                            root: classes.header,
                            controls: classes.headerControls,
                            control: classes.headerControl,
                            previousControl: classes.headerPreviousControl,
                            nextControl: classes.headerNextControl,
                            label: classes.headerLabel
                        }}
                    />

                    <div
                        role="row"
                        className={cx(
                            "grid grid-cols-7 text-center text-[var(--refraktor-text-secondary)]",
                            sizeStyles.label,
                            sizeStyles.gridGap,
                            classes.weekdays
                        )}
                    >
                        {weekdays.map((weekday, index) => {
                            const dayOfWeek =
                                (firstDayOfWeek + index) % DAYS_IN_WEEK;

                            return (
                                <span
                                    key={`${weekday}-${index}`}
                                    className={cx("truncate", classes.weekday)}
                                >
                                    {getWeekdayLabel
                                        ? getWeekdayLabel(dayOfWeek, weekday)
                                        : weekday}
                                </span>
                            );
                        })}
                    </div>

                    <div
                        role="grid"
                        aria-label={`Date picker, ${createDate(displayedMonth).format("MMMM YYYY")}`}
                        className={cx(
                            "grid",
                            getGridColumns(DAYS_IN_WEEK),
                            sizeStyles.gridGap,
                            classes.grid
                        )}
                        onKeyDown={handleGridKeyDown}
                    >
                        {visibleDays.map((day) => {
                            const isOutside = !isSameMonth(day, displayedMonth);
                            const isSelected =
                                selectedDate !== undefined &&
                                isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, today);
                            const isDayDisabled = isDateDisabled(
                                day,
                                disabled ?? false,
                                bounds
                            );
                            const tabIndex =
                                isSelected ||
                                (!hasVisibleSelection &&
                                    firstAvailableDay !== undefined &&
                                    isSameDay(day, firstAvailableDay))
                                    ? 0
                                    : -1;

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    role="gridcell"
                                    aria-selected={isSelected}
                                    aria-current={isToday ? "date" : undefined}
                                    aria-label={resolveDayAriaLabel(
                                        day,
                                        isSelected,
                                        isOutside,
                                        isDayDisabled
                                    )}
                                    tabIndex={tabIndex}
                                    data-active={isSelected}
                                    data-outside={isOutside}
                                    data-today={isToday}
                                    data-disabled={isDayDisabled}
                                    disabled={isDayDisabled}
                                    className={cx(
                                        "inline-flex items-center justify-center font-medium text-[var(--refraktor-text)] transition-colors",
                                        "hover:bg-[var(--refraktor-bg-hover)]",
                                        isSelected &&
                                            "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)] hover:bg-[var(--refraktor-primary)]",
                                        isOutside &&
                                            "text-[var(--refraktor-text-secondary)]",
                                        isToday &&
                                            !isSelected &&
                                            "ring-1 ring-[var(--refraktor-primary)]",
                                        isDayDisabled &&
                                            "pointer-events-none cursor-not-allowed opacity-50",
                                        sizeStyles.cell,
                                        getRadius(radius),
                                        classes.day,
                                        isOutside && classes.dayOutside,
                                        isToday && classes.dayToday,
                                        isSelected && classes.daySelected,
                                        isDayDisabled && classes.dayDisabled
                                    )}
                                    onClick={() => setDay(day)}
                                >
                                    {getDayLabel ? getDayLabel(day) : day.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
});

DatePicker.displayName = "@refraktor/dates/DatePicker";
DatePicker.configure = createComponentConfig<DatePickerProps>();
DatePicker.classNames = createClassNamesConfig<DatePickerClassNames>();

export default DatePicker;
