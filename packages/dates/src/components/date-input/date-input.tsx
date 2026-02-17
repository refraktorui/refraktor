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
import { DatePicker } from "../date-picker";
import {
    DateInputClassNames,
    DateInputFactoryPayload,
    DateInputProps
} from "./date-input.types";

const DEFAULT_MONTH_PICKER_COLUMNS = 3;
const DEFAULT_YEAR_PICKER_YEARS_PER_PAGE = 9;
const DEFAULT_YEAR_PICKER_COLUMNS = 3;
const DEFAULT_VALUE_FORMAT = "MMMM D, YYYY";

const defaultProps = {
    monthPickerColumns: DEFAULT_MONTH_PICKER_COLUMNS,
    yearPickerYearsPerPage: DEFAULT_YEAR_PICKER_YEARS_PER_PAGE,
    yearPickerColumns: DEFAULT_YEAR_PICKER_COLUMNS,
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
} satisfies Partial<DateInputProps>;

const isValidDate = (value: unknown): value is Date =>
    value instanceof Date && !Number.isNaN(value.getTime());

const normalizeDateValue = (value: Date | undefined) => {
    if (!isValidDate(value)) {
        return undefined;
    }

    const normalizedValue = new Date(value);
    normalizedValue.setHours(0, 0, 0, 0);
    return normalizedValue;
};

const DateInput = factory<DateInputFactoryPayload>((_props, ref) => {
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
        minDate,
        maxDate,
        monthPickerColumns,
        yearPickerYearsPerPage,
        yearPickerColumns,
        getWeekdayLabel,
        getDayLabel,
        getDayAriaLabel,
        getHeaderLabel,
        getNavigationAriaLabel,
        getMonthLabel,
        getMonthAriaLabel,
        getMonthHeaderLabel,
        getMonthNavigationAriaLabel,
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
    } = useProps("DateInput", defaultProps, _props);
    const classes = useClassNames("DateInput", classNames);

    const _id = useId(id);
    const dropdownId = `${_id}-dropdown`;

    const [selectedDateState, setSelectedDate] = useUncontrolled<Date | undefined>({
        value,
        defaultValue,
        finalValue: undefined,
        onChange: (nextDate) => {
            if (nextDate !== undefined) {
                onChange?.(nextDate);
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

    const handleDateChange = useCallback(
        (nextDate: Date) => {
            const normalizedDate = normalizeDateValue(nextDate);

            if (normalizedDate === undefined) {
                return;
            }

            setSelectedDate(normalizedDate);
            setIsOpen(false);
        },
        [setIsOpen, setSelectedDate]
    );

    const selectedDate = normalizeDateValue(selectedDateState);
    const inputValue =
        selectedDate === undefined ? "" : createDate(selectedDate).format(valueFormat);

    const mergedReferenceProps = getReferenceProps({
        onFocus,
        onBlur,
        onClick,
        onKeyDown: handleInputKeyDown
    });

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
                    "w-80 z-50 border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] p-2 text-[var(--refraktor-text)] shadow-md",
                    getRadius(radius),
                    classes.dropdown
                )}
                {...getFloatingProps()}
            >
                <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    monthPickerColumns={monthPickerColumns}
                    yearPickerYearsPerPage={yearPickerYearsPerPage}
                    yearPickerColumns={yearPickerColumns}
                    disabled={disabled}
                    size={size}
                    radius={radius}
                    getWeekdayLabel={getWeekdayLabel}
                    getDayLabel={getDayLabel}
                    getDayAriaLabel={getDayAriaLabel}
                    getHeaderLabel={getHeaderLabel}
                    getNavigationAriaLabel={getNavigationAriaLabel}
                    getMonthLabel={getMonthLabel}
                    getMonthAriaLabel={getMonthAriaLabel}
                    getMonthHeaderLabel={getMonthHeaderLabel}
                    getMonthNavigationAriaLabel={getMonthNavigationAriaLabel}
                    className={cx("bg-transparent p-0", classes.datePicker)}
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

DateInput.displayName = "@refraktor/dates/DateInput";
DateInput.configure = createComponentConfig<DateInputProps>();
DateInput.classNames = createClassNamesConfig<DateInputClassNames>();

export default DateInput;
