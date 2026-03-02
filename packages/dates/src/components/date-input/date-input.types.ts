import type {
    FlipOptions,
    InlineOptions,
    Placement,
    ShiftOptions,
    Strategy
} from "@floating-ui/react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload,
    InputFieldClassNames,
    InputProps,
    RefraktorRadius,
    RefraktorSize,
    TransitionProps
} from "@refraktor/core";
import type {
    DatePickerGetDayAriaLabel,
    DatePickerGetDayLabel,
    DatePickerGetHeaderLabel,
    DatePickerGetNavigationAriaLabel,
    DatePickerGetWeekdayLabel
} from "../date-picker";
import type {
    MonthPickerGetHeaderLabel,
    MonthPickerGetMonthAriaLabel,
    MonthPickerGetMonthLabel,
    MonthPickerGetNavigationAriaLabel
} from "../month-picker";

export type DateInputValue = Date;
export type DateInputSize = RefraktorSize;
export type DateInputRadius = RefraktorRadius;
export type DateInputOnChange = (value: DateInputValue) => void;
export type DateInputValueFormat = string;

export type DateInputPositioning = {
    /** The placement of the dropdown relative to the input @default `bottom-start` */
    placement?: Placement;

    /** Offset distance from the input in pixels @default `4` */
    offset?: number;
};

export type DateInputMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type DateInputClassNames = {
    input?: string;
    dropdown?: string;
    datePicker?: string;
};

interface _DateInputProps {
    /** Selected date (controlled). */
    value?: DateInputValue;

    /** Initial selected date (uncontrolled). */
    defaultValue?: DateInputValue;

    /** Callback called when selected date changes. */
    onChange?: DateInputOnChange;

    /** Dropdown open state (controlled). */
    opened?: boolean;

    /** Initial dropdown open state (uncontrolled). */
    defaultOpened?: boolean;

    /** Callback called when dropdown open state changes. */
    onOpenedChange?: (opened: boolean) => void;

    /** Minimum selectable date. */
    minDate?: Date;

    /** Maximum selectable date. */
    maxDate?: Date;

    /** Month picker columns @default `3` */
    monthPickerColumns?: number;

    /** Year picker years rendered in one page @default `9` */
    yearPickerYearsPerPage?: number;

    /** Year picker columns @default `3` */
    yearPickerColumns?: number;

    /** Custom weekday label renderer. */
    getWeekdayLabel?: DatePickerGetWeekdayLabel;

    /** Custom day label renderer. */
    getDayLabel?: DatePickerGetDayLabel;

    /** Custom aria-label generator for day buttons. */
    getDayAriaLabel?: DatePickerGetDayAriaLabel;

    /** Custom header label renderer for visible month. */
    getHeaderLabel?: DatePickerGetHeaderLabel;

    /** Custom aria-label generator for previous/next controls. */
    getNavigationAriaLabel?: DatePickerGetNavigationAriaLabel;

    /** Custom month label renderer in month view. */
    getMonthLabel?: MonthPickerGetMonthLabel;

    /** Custom aria-label generator for month buttons in month view. */
    getMonthAriaLabel?: MonthPickerGetMonthAriaLabel;

    /** Custom header label renderer in month view. */
    getMonthHeaderLabel?: MonthPickerGetHeaderLabel;

    /** Custom aria-label generator for month view navigation controls. */
    getMonthNavigationAriaLabel?: MonthPickerGetNavigationAriaLabel;

    /** Dayjs format used to render selected date in the input @default `MMMM D, YYYY` */
    valueFormat?: DateInputValueFormat;

    /** Positioning settings for the dropdown. */
    positioning?: DateInputPositioning;

    /** CSS positioning strategy used by Floating UI @default `fixed` */
    strategy?: Strategy;

    /** Floating middleware settings. */
    middlewares?: DateInputMiddlewares;

    /** Whether to render dropdown in a portal @default `true` */
    withinPortal?: boolean;

    /** Whether to close on click outside @default `true` */
    closeOnClickOutside?: boolean;

    /** Whether to close on Escape key @default `true` */
    closeOnEscape?: boolean;

    /** Transition props for dropdown, uses Transition internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Used for styling the core Input field parts. */
    inputClassNames?: InputFieldClassNames;

    /** Used for styling DateInput parts. */
    classNames?: DateInputClassNames;
}

export type DateInputProps = _DateInputProps &
    Omit<
        InputProps,
        "value" | "defaultValue" | "onChange" | "readOnly" | "classNames"
    >;

export interface DateInputFactoryPayload extends FactoryPayload {
    props: DateInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<DateInputProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<DateInputClassNames>
        >;
    };
}
