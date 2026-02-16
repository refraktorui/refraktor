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

export type YearInputValue = number;
export type YearInputSize = RefraktorSize;
export type YearInputRadius = RefraktorRadius;
export type YearInputOnChange = (value: YearInputValue) => void;

export type YearInputPositioning = {
    /** The placement of the dropdown relative to the input @default `bottom-start` */
    placement?: Placement;

    /** Offset distance from the input in pixels @default `4` */
    offset?: number;
};

export type YearInputMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type YearInputClassNames = {
    input?: string;
    dropdown?: string;
    yearPicker?: string;
};

interface _YearInputProps {
    /** Selected year (controlled). */
    value?: YearInputValue;

    /** Initial selected year (uncontrolled). */
    defaultValue?: YearInputValue;

    /** Callback called when selected year changes. */
    onChange?: YearInputOnChange;

    /** Dropdown open state (controlled). */
    opened?: boolean;

    /** Initial dropdown open state (uncontrolled). */
    defaultOpened?: boolean;

    /** Callback called when dropdown open state changes. */
    onOpenedChange?: (opened: boolean) => void;

    /** Minimum selectable year. */
    minYear?: number;

    /** Maximum selectable year. */
    maxYear?: number;

    /** Years rendered in one page @default `9` */
    yearsPerPage?: number;

    /** Grid columns used by the year list @default `3` */
    columns?: number;

    /** Positioning settings for the dropdown. */
    positioning?: YearInputPositioning;

    /** Floating middleware settings. */
    middlewares?: YearInputMiddlewares;

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

    /** Used for styling YearInput parts. */
    classNames?: YearInputClassNames;
}

export type YearInputProps = _YearInputProps &
    Omit<
        InputProps,
        "value" | "defaultValue" | "onChange" | "readOnly" | "classNames"
    >;

export interface YearInputFactoryPayload extends FactoryPayload {
    props: YearInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<YearInputProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<YearInputClassNames>
        >;
    };
}
