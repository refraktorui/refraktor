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
import { MonthPicker } from "../month-picker";
import {
    MonthInputClassNames,
    MonthInputFactoryPayload,
    MonthInputProps
} from "./month-input.types";

const DEFAULT_COLUMNS = 3;
const DEFAULT_YEAR_PICKER_YEARS_PER_PAGE = 9;
const DEFAULT_YEAR_PICKER_COLUMNS = 3;
const DEFAULT_VALUE_FORMAT = "MMMM YYYY";

const defaultProps = {
    columns: DEFAULT_COLUMNS,
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
    strategy: "fixed",
    middlewares: {
        flip: true,
        shift: true
    },
    withinPortal: true,
    closeOnClickOutside: true,
    closeOnEscape: true
} satisfies Partial<MonthInputProps>;

const isValidDate = (value: unknown): value is Date =>
    value instanceof Date && !Number.isNaN(value.getTime());

const normalizeMonthValue = (value: Date | undefined) => {
    if (!isValidDate(value)) {
        return undefined;
    }

    const normalizedValue = new Date(value);
    normalizedValue.setDate(1);
    normalizedValue.setHours(0, 0, 0, 0);
    return normalizedValue;
};

const MonthInput = factory<MonthInputFactoryPayload>((_props, ref) => {
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
        minYear,
        maxYear,
        columns,
        yearPickerYearsPerPage,
        yearPickerColumns,
        getMonthLabel,
        getMonthAriaLabel,
        getHeaderLabel,
        getNavigationAriaLabel,
        valueFormat,
        disabled,
        size,
        radius,
        positioning,
        strategy,
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
    } = useProps("MonthInput", defaultProps, _props);
    const classes = useClassNames("MonthInput", classNames);

    const _id = useId(id);
    const dropdownId = `${_id}-dropdown`;

    const [selectedMonthState, setSelectedMonth] = useUncontrolled<
        Date | undefined
    >({
        value,
        defaultValue,
        finalValue: undefined,
        onChange: (nextMonth) => {
            if (nextMonth !== undefined) {
                onChange?.(nextMonth);
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
        strategy
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

    const handleMonthChange = useCallback(
        (nextMonth: Date) => {
            setSelectedMonth(nextMonth);
            setIsOpen(false);
        },
        [setIsOpen, setSelectedMonth]
    );

    const selectedMonth = normalizeMonthValue(selectedMonthState);
    const inputValue =
        selectedMonth === undefined ? "" : createDate(selectedMonth).format(valueFormat);

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
                    "w-72 z-50 border border-[var(--refraktor-border)] bg-[var(--refraktor-bg)] p-2 text-[var(--refraktor-text)] shadow-md",
                    getRadius(radius),
                    classes.dropdown
                )}
                {...getFloatingProps()}
            >
                <MonthPicker
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    minYear={minYear}
                    maxYear={maxYear}
                    columns={columns}
                    yearPickerYearsPerPage={yearPickerYearsPerPage}
                    yearPickerColumns={yearPickerColumns}
                    disabled={disabled}
                    size={size}
                    radius={radius}
                    getMonthLabel={getMonthLabel}
                    getMonthAriaLabel={getMonthAriaLabel}
                    getHeaderLabel={getHeaderLabel}
                    getNavigationAriaLabel={getNavigationAriaLabel}
                    className={cx("bg-transparent p-0", classes.monthPicker)}
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

MonthInput.displayName = "@refraktor/dates/MonthInput";
MonthInput.configure = createComponentConfig<MonthInputProps>();
MonthInput.classNames = createClassNamesConfig<MonthInputClassNames>();

export default MonthInput;
