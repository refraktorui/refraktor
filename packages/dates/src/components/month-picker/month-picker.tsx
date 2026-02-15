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
import { YearPicker } from "../year-picker";
import {
    MonthPickerClassNames,
    MonthPickerFactoryPayload,
    MonthPickerNavigationDirection,
    MonthPickerProps
} from "./month-picker.types";

const DEFAULT_COLUMNS = 3;
const DEFAULT_YEAR_PICKER_YEARS_PER_PAGE = 9;
const DEFAULT_YEAR_PICKER_COLUMNS = 3;
const MONTHS_IN_YEAR = 12;

const defaultProps = {
    columns: DEFAULT_COLUMNS,
    yearPickerYearsPerPage: DEFAULT_YEAR_PICKER_YEARS_PER_PAGE,
    yearPickerColumns: DEFAULT_YEAR_PICKER_COLUMNS,
    disabled: false,
    size: "md",
    radius: "default"
} satisfies Partial<MonthPickerProps>;

type YearBounds = {
    min: number;
    max: number;
    hasMin: boolean;
    hasMax: boolean;
};

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

const getBounds = (minYear?: number, maxYear?: number): YearBounds => {
    const hasMin = Number.isFinite(minYear);
    const hasMax = Number.isFinite(maxYear);

    const min = hasMin
        ? Math.trunc(minYear as number)
        : Number.MIN_SAFE_INTEGER;
    const max = hasMax
        ? Math.trunc(maxYear as number)
        : Number.MAX_SAFE_INTEGER;

    if (min <= max) {
        return { min, max, hasMin, hasMax };
    }

    return {
        min: max,
        max: min,
        hasMin,
        hasMax
    };
};

const createMonthValue = (baseDate: Date, year: number, month: number) => {
    const nextDate = new Date(baseDate);
    nextDate.setFullYear(year, month, 1);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
};

const isSameMonth = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth();

type MonthPickerView = "month" | "year";

const MonthPicker = factory<MonthPickerFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const { createDate } = useDates();
    const {
        id,
        value,
        defaultValue,
        onChange,
        minYear,
        maxYear,
        columns,
        yearPickerYearsPerPage,
        yearPickerColumns,
        disabled,
        size,
        radius,
        getMonthLabel,
        getMonthAriaLabel,
        getHeaderLabel,
        getNavigationAriaLabel,
        className,
        classNames,
        ...props
    } = useProps("MonthPicker", defaultProps, _props);
    const classes = useClassNames("MonthPicker", classNames);

    const _id = useId(id);

    const today = new Date();
    const currentYear = today.getFullYear();
    const bounds = useMemo(
        () => getBounds(minYear, maxYear),
        [minYear, maxYear]
    );

    const safeColumns = clamp(
        toSafeInteger(columns, DEFAULT_COLUMNS),
        1,
        Math.min(6, MONTHS_IN_YEAR)
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

    const selectedDate = isValidDate(selectedDateState)
        ? selectedDateState
        : undefined;
    const selectedYear = selectedDate?.getFullYear();

    const [displayedYear, setDisplayedYear] = useState(() =>
        clamp(selectedYear ?? currentYear, bounds.min, bounds.max)
    );
    const [view, setView] = useState<MonthPickerView>("month");

    useEffect(() => {
        setDisplayedYear((previousYear) =>
            clamp(previousYear, bounds.min, bounds.max)
        );
    }, [bounds.max, bounds.min]);

    useEffect(() => {
        if (selectedYear === undefined) {
            return;
        }

        const normalizedYear = clamp(selectedYear, bounds.min, bounds.max);

        setDisplayedYear((previousYear) => {
            if (previousYear === normalizedYear) {
                return previousYear;
            }

            return normalizedYear;
        });
    }, [bounds.max, bounds.min, selectedYear]);

    const canGoPrevious =
        !disabled && (!bounds.hasMin || displayedYear > bounds.min);
    const canGoNext = !disabled && (!bounds.hasMax || displayedYear < bounds.max);

    const sizeStyles = getPickerSizeStyles(size);

    const resolveNavigationLabel = (
        direction: MonthPickerNavigationDirection
    ) => {
        if (getNavigationAriaLabel) {
            return getNavigationAriaLabel(direction, displayedYear);
        }

        return direction === "previous"
            ? `Show previous year (${displayedYear - 1})`
            : `Show next year (${displayedYear + 1})`;
    };

    const monthItems = useMemo(
        () =>
            Array.from({ length: MONTHS_IN_YEAR }, (_, month) => {
                const dayjsMonth = createDate(new Date(displayedYear, month, 1));

                return {
                    month,
                    label: getMonthLabel
                        ? getMonthLabel(month, displayedYear, dayjsMonth.toDate())
                        : dayjsMonth.format("MMM"),
                    fullLabel: dayjsMonth.format("MMMM")
                };
            }),
        [createDate, displayedYear, getMonthLabel]
    );

    const selectedMonth =
        selectedDate !== undefined && selectedDate.getFullYear() === displayedYear
            ? selectedDate.getMonth()
            : undefined;

    const resolveMonthAriaLabel = (month: number, isSelected: boolean) => {
        if (getMonthAriaLabel) {
            return getMonthAriaLabel(month, displayedYear, isSelected);
        }

        const fullMonthLabel = monthItems[month]?.fullLabel ?? `Month ${month + 1}`;

        return isSelected
            ? `${fullMonthLabel} ${displayedYear}, selected`
            : `Choose ${fullMonthLabel} ${displayedYear}`;
    };

    const handleMonthSelect = (month: number, year = displayedYear) => {
        if (disabled) {
            return;
        }

        const normalizedMonth = clamp(month, 0, MONTHS_IN_YEAR - 1);
        const normalizedYear = clamp(year, bounds.min, bounds.max);

        setDisplayedYear(normalizedYear);

        const baseDate = selectedDate ?? today;
        const nextDate = createMonthValue(baseDate, normalizedYear, normalizedMonth);

        if (selectedDate && isSameMonth(selectedDate, nextDate)) {
            return;
        }

        setSelectedDate(nextDate);
    };

    const shiftYear = (direction: -1 | 1) => {
        setDisplayedYear((previousYear) =>
            clamp(previousYear + direction, bounds.min, bounds.max)
        );
    };

    const handlePrevious = () => {
        if (!canGoPrevious) {
            return;
        }

        shiftYear(-1);
    };

    const handleNext = () => {
        if (!canGoNext) {
            return;
        }

        shiftYear(1);
    };

    const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        const keyboardBaseMonth = selectedMonth ?? 0;

        const keyboardSteps: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -safeColumns,
            ArrowDown: safeColumns
        };

        const step = keyboardSteps[event.key];

        if (step !== undefined) {
            event.preventDefault();
            handleMonthSelect(keyboardBaseMonth + step);
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            handleMonthSelect(0);
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            handleMonthSelect(MONTHS_IN_YEAR - 1);
            return;
        }

        if (event.key === "PageUp") {
            event.preventDefault();
            handleMonthSelect(keyboardBaseMonth, displayedYear - 1);
            return;
        }

        if (event.key === "PageDown") {
            event.preventDefault();
            handleMonthSelect(keyboardBaseMonth, displayedYear + 1);
        }
    };

    const handleHeaderLabelClick = () => {
        if (disabled) {
            return;
        }

        setView("year");
    };

    const handleYearSelect = (year: number) => {
        setDisplayedYear(clamp(year, bounds.min, bounds.max));
        setView("month");
    };

    const hasVisibleSelection = selectedMonth !== undefined;

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
            {view === "year" ? (
                <YearPicker
                    value={displayedYear}
                    onChange={handleYearSelect}
                    minYear={minYear}
                    maxYear={maxYear}
                    yearsPerPage={safeYearPickerYearsPerPage}
                    columns={safeYearPickerColumns}
                    disabled={disabled}
                    size={size}
                    radius={radius}
                    className={cx("bg-transparent p-0", classes.yearPicker)}
                />
            ) : (
                <>
                    <PickerHeader
                        label={
                            getHeaderLabel ? getHeaderLabel(displayedYear) : displayedYear
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
                        role="grid"
                        aria-label={`Month picker, ${displayedYear}`}
                        className={cx(
                            "grid",
                            getGridColumns(safeColumns),
                            sizeStyles.gridGap,
                            classes.grid
                        )}
                        onKeyDown={handleGridKeyDown}
                    >
                        {monthItems.map(({ month, label }) => {
                            const isSelected = month === selectedMonth;
                            const tabIndex =
                                isSelected || (!hasVisibleSelection && month === 0)
                                    ? 0
                                    : -1;

                            return (
                                <button
                                    key={month}
                                    type="button"
                                    role="gridcell"
                                    aria-selected={isSelected}
                                    aria-label={resolveMonthAriaLabel(month, isSelected)}
                                    tabIndex={tabIndex}
                                    data-active={isSelected}
                                    data-disabled={disabled}
                                    disabled={disabled}
                                    className={cx(
                                        "inline-flex items-center justify-center font-medium text-[var(--refraktor-text)] transition-colors",
                                        isSelected
                                            ? "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]"
                                            : "hover:bg-[var(--refraktor-bg-hover)]",
                                        disabled &&
                                            "pointer-events-none cursor-not-allowed opacity-50 data-[disabled=true]:pointer-events-none",
                                        sizeStyles.cell,
                                        getRadius(radius),
                                        classes.month,
                                        isSelected && classes.monthActive
                                    )}
                                    onClick={() => handleMonthSelect(month)}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
});

MonthPicker.displayName = "@refraktor/dates/MonthPicker";
MonthPicker.configure = createComponentConfig<MonthPickerProps>();
MonthPicker.classNames = createClassNamesConfig<MonthPickerClassNames>();

export default MonthPicker;
