import type {
    FlipOptions,
    InlineOptions,
    Placement,
    ShiftOptions
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
    MonthPickerGetHeaderLabel,
    MonthPickerGetMonthAriaLabel,
    MonthPickerGetMonthLabel,
    MonthPickerGetNavigationAriaLabel
} from "../month-picker";

export type MonthInputValue = Date;
export type MonthInputSize = RefraktorSize;
export type MonthInputRadius = RefraktorRadius;
export type MonthInputOnChange = (value: MonthInputValue) => void;
export type MonthInputValueFormat = string;

export type MonthInputPositioning = {
    /** The placement of the dropdown relative to the input @default `bottom-start` */
    placement?: Placement;

    /** Offset distance from the input in pixels @default `4` */
    offset?: number;
};

export type MonthInputMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type MonthInputClassNames = {
    input?: string;
    dropdown?: string;
    monthPicker?: string;
};

interface _MonthInputProps {
    /** Selected month (controlled). */
    value?: MonthInputValue;

    /** Initial selected month (uncontrolled). */
    defaultValue?: MonthInputValue;

    /** Callback called when selected month changes. */
    onChange?: MonthInputOnChange;

    /** Dropdown open state (controlled). */
    opened?: boolean;

    /** Initial dropdown open state (uncontrolled). */
    defaultOpened?: boolean;

    /** Callback called when dropdown open state changes. */
    onOpenedChange?: (opened: boolean) => void;

    /** Minimum selectable year in month and year views. */
    minYear?: number;

    /** Maximum selectable year in month and year views. */
    maxYear?: number;

    /** Grid columns used by the month list @default `3` */
    columns?: number;

    /** Year picker years rendered in one page @default `9` */
    yearPickerYearsPerPage?: number;

    /** Year picker columns @default `3` */
    yearPickerColumns?: number;

    /** Custom month label renderer. */
    getMonthLabel?: MonthPickerGetMonthLabel;

    /** Custom aria-label generator for month buttons. */
    getMonthAriaLabel?: MonthPickerGetMonthAriaLabel;

    /** Custom header label renderer for visible year. */
    getHeaderLabel?: MonthPickerGetHeaderLabel;

    /** Custom aria-label generator for previous/next controls. */
    getNavigationAriaLabel?: MonthPickerGetNavigationAriaLabel;

    /** Dayjs format used to render selected month in the input @default `MMMM YYYY` */
    valueFormat?: MonthInputValueFormat;

    /** Positioning settings for the dropdown. */
    positioning?: MonthInputPositioning;

    /** Floating middleware settings. */
    middlewares?: MonthInputMiddlewares;

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

    /** Used for styling MonthInput parts. */
    classNames?: MonthInputClassNames;
}

export type MonthInputProps = _MonthInputProps &
    Omit<
        InputProps,
        "value" | "defaultValue" | "onChange" | "readOnly" | "classNames"
    >;

export interface MonthInputFactoryPayload extends FactoryPayload {
    props: MonthInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<MonthInputProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<MonthInputClassNames>
        >;
    };
}
