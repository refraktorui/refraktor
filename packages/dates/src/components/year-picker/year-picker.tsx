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
import {
    YearPickerClassNames,
    YearPickerFactoryPayload,
    YearPickerNavigationDirection,
    YearPickerProps,
    YearPickerRange
} from "./year-picker.types";

const DEFAULT_YEARS_PER_PAGE = 9;
const DEFAULT_COLUMNS = 3;

const defaultProps = {
    yearsPerPage: DEFAULT_YEARS_PER_PAGE,
    columns: DEFAULT_COLUMNS,
    disabled: false,
    size: "md",
    radius: "default"
} satisfies Partial<YearPickerProps>;

type YearBounds = {
    min: number;
    max: number;
    hasMin: boolean;
    hasMax: boolean;
};

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

const getCenteredRangeStart = (year: number, yearsPerPage: number) =>
    year - Math.floor(yearsPerPage / 2);

const clampRangeStart = (
    rangeStart: number,
    bounds: YearBounds,
    yearsPerPage: number
) => {
    const totalVisibleYears = bounds.max - bounds.min + 1;

    if (totalVisibleYears <= yearsPerPage) {
        return bounds.min;
    }

    const maxStart = bounds.max - yearsPerPage + 1;

    return clamp(rangeStart, bounds.min, maxStart);
};

const getRangeEnd = (
    rangeStart: number,
    yearsPerPage: number,
    bounds: YearBounds
) => Math.min(rangeStart + yearsPerPage - 1, bounds.max);

const ensureRangeContainsYear = (
    year: number,
    rangeStart: number,
    bounds: YearBounds,
    yearsPerPage: number
) => {
    const normalizedRangeStart = clampRangeStart(
        rangeStart,
        bounds,
        yearsPerPage
    );
    const rangeEnd = getRangeEnd(normalizedRangeStart, yearsPerPage, bounds);

    if (year >= normalizedRangeStart && year <= rangeEnd) {
        return normalizedRangeStart;
    }

    return clampRangeStart(
        getCenteredRangeStart(year, yearsPerPage),
        bounds,
        yearsPerPage
    );
};

const getVisibleYears = (
    rangeStart: number,
    bounds: YearBounds,
    yearsPerPage: number
) => {
    const years: number[] = [];

    for (let index = 0; index < yearsPerPage; index += 1) {
        const year = rangeStart + index;

        if (year < bounds.min || year > bounds.max) {
            continue;
        }

        years.push(year);
    }

    return years;
};

const YearPicker = factory<YearPickerFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        value,
        defaultValue,
        onChange,
        minYear,
        maxYear,
        yearsPerPage,
        columns,
        disabled,
        size,
        radius,
        getYearLabel,
        getYearAriaLabel,
        getHeaderLabel,
        getNavigationAriaLabel,
        className,
        classNames,
        ...props
    } = useProps("YearPicker", defaultProps, _props);
    const classes = useClassNames("YearPicker", classNames);

    const _id = useId(id);

    const currentYear = new Date().getFullYear();
    const bounds = useMemo(
        () => getBounds(minYear, maxYear),
        [minYear, maxYear]
    );
    const safeYearsPerPage = Math.max(
        1,
        toSafeInteger(yearsPerPage, DEFAULT_YEARS_PER_PAGE)
    );
    const safeColumns = clamp(
        toSafeInteger(columns, DEFAULT_COLUMNS),
        1,
        Math.min(6, safeYearsPerPage)
    );

    const [selectedYearState, setSelectedYear, isControlled] = useUncontrolled<
        number | undefined
    >({
        value,
        defaultValue,
        finalValue: undefined,
        onChange: (nextYear) => {
            if (nextYear !== undefined) {
                onChange?.(nextYear);
            }
        }
    });

    const initialSelectedYear = clamp(
        toSafeInteger(selectedYearState, currentYear),
        bounds.min,
        bounds.max
    );

    const [rangeStart, setRangeStart] = useState(() =>
        clampRangeStart(
            getCenteredRangeStart(initialSelectedYear, safeYearsPerPage),
            bounds,
            safeYearsPerPage
        )
    );

    const selectedYear =
        selectedYearState === undefined
            ? undefined
            : clamp(
                  toSafeInteger(selectedYearState, currentYear),
                  bounds.min,
                  bounds.max
              );

    const rangeAnchorYear =
        selectedYear ?? clamp(currentYear, bounds.min, bounds.max);

    useEffect(() => {
        if (isControlled) {
            return;
        }

        if (selectedYearState === undefined || selectedYear === undefined) {
            return;
        }

        if (selectedYearState !== selectedYear) {
            setSelectedYear(selectedYear);
        }
    }, [
        bounds.max,
        bounds.min,
        isControlled,
        selectedYear,
        selectedYearState,
        setSelectedYear
    ]);

    useEffect(() => {
        setRangeStart((previousRangeStart) =>
            ensureRangeContainsYear(
                rangeAnchorYear,
                previousRangeStart,
                bounds,
                safeYearsPerPage
            )
        );
    }, [bounds, rangeAnchorYear, safeYearsPerPage]);

    const visibleYears = useMemo(
        () => getVisibleYears(rangeStart, bounds, safeYearsPerPage),
        [bounds, rangeStart, safeYearsPerPage]
    );

    const visibleRange: YearPickerRange = {
        start: visibleYears[0] ?? rangeStart,
        end:
            visibleYears[visibleYears.length - 1] ??
            getRangeEnd(rangeStart, safeYearsPerPage, bounds)
    };

    const sizeStyles = getPickerSizeStyles(size);

    const canGoPrevious =
        !disabled && (!bounds.hasMin || rangeStart > bounds.min);
    const canGoNext =
        !disabled &&
        (!bounds.hasMax ||
            getRangeEnd(rangeStart, safeYearsPerPage, bounds) < bounds.max);

    const resolveNavigationLabel = (
        direction: YearPickerNavigationDirection
    ) => {
        if (getNavigationAriaLabel) {
            return getNavigationAriaLabel(direction, visibleRange);
        }

        return direction === "previous"
            ? "Show previous years"
            : "Show next years";
    };

    const resolveYearAriaLabel = (year: number, isSelected: boolean) => {
        if (getYearAriaLabel) {
            return getYearAriaLabel(year, isSelected);
        }

        return isSelected ? `Year ${year}, selected` : `Choose year ${year}`;
    };

    const setYear = (nextYear: number) => {
        if (disabled) {
            return;
        }

        const normalizedYear = clamp(nextYear, bounds.min, bounds.max);

        if (normalizedYear === selectedYear) {
            return;
        }

        setSelectedYear(normalizedYear);
    };

    const shiftRange = (direction: -1 | 1) => {
        setRangeStart((previousRangeStart) =>
            clampRangeStart(
                previousRangeStart + direction * safeYearsPerPage,
                bounds,
                safeYearsPerPage
            )
        );
    };

    const handlePrevious = () => {
        if (!canGoPrevious) {
            return;
        }

        shiftRange(-1);
    };

    const handleNext = () => {
        if (!canGoNext) {
            return;
        }

        shiftRange(1);
    };

    const handleYearSelect = (year: number) => {
        setRangeStart((previousRangeStart) =>
            ensureRangeContainsYear(
                year,
                previousRangeStart,
                bounds,
                safeYearsPerPage
            )
        );
        setYear(year);
    };

    const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        const keyboardBaseYear =
            selectedYear ?? visibleYears[0] ?? rangeAnchorYear;

        const keyboardSteps: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -safeColumns,
            ArrowDown: safeColumns
        };

        const step = keyboardSteps[event.key];

        if (step !== undefined) {
            event.preventDefault();
            const nextYear = clamp(
                keyboardBaseYear + step,
                bounds.min,
                bounds.max
            );
            handleYearSelect(nextYear);
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();

            if (visibleYears.length > 0) {
                handleYearSelect(visibleYears[0]);
            }

            return;
        }

        if (event.key === "End") {
            event.preventDefault();

            if (visibleYears.length > 0) {
                handleYearSelect(visibleYears[visibleYears.length - 1]);
            }

            return;
        }

        if (event.key === "PageUp") {
            event.preventDefault();
            handleYearSelect(keyboardBaseYear - safeYearsPerPage);
            return;
        }

        if (event.key === "PageDown") {
            event.preventDefault();
            handleYearSelect(keyboardBaseYear + safeYearsPerPage);
        }
    };

    const hasVisibleSelection =
        selectedYear !== undefined && visibleYears.includes(selectedYear);

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
            <PickerHeader
                label={
                    getHeaderLabel
                        ? getHeaderLabel(visibleRange)
                        : `${visibleRange.start} - ${visibleRange.end}`
                }
                onPrevious={handlePrevious}
                onNext={handleNext}
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
                aria-label="Year picker"
                className={cx(
                    "grid",
                    getGridColumns(safeColumns),
                    sizeStyles.gridGap,
                    classes.grid
                )}
                onKeyDown={handleGridKeyDown}
            >
                {visibleYears.map((year, index) => {
                    const isSelected = year === selectedYear;
                    const tabIndex =
                        isSelected || (!hasVisibleSelection && index === 0)
                            ? 0
                            : -1;

                    return (
                        <button
                            key={year}
                            type="button"
                            role="gridcell"
                            aria-selected={isSelected}
                            aria-label={resolveYearAriaLabel(year, isSelected)}
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
                                classes.year
                            )}
                            onClick={() => handleYearSelect(year)}
                        >
                            {getYearLabel ? getYearLabel(year) : year}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

YearPicker.displayName = "@refraktor/dates/YearPicker";
YearPicker.configure = createComponentConfig<YearPickerProps>();
YearPicker.classNames = createClassNamesConfig<YearPickerClassNames>();

export default YearPicker;
