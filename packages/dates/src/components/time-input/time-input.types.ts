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
    TimePickerGetHourAriaLabel,
    TimePickerGetHourLabel,
    TimePickerGetMinuteAriaLabel,
    TimePickerGetMinuteLabel,
    TimePickerGetPeriodAriaLabel,
    TimePickerGetPeriodLabel,
    TimePickerGetSecondAriaLabel,
    TimePickerGetSecondLabel,
    TimePickerMode,
    TimePickerOnChange,
    TimePickerPeriod,
    TimePickerValue
} from "../time-picker";

export type TimeInputValue = TimePickerValue;
export type TimeInputMode = TimePickerMode;
export type TimeInputPeriod = TimePickerPeriod;
export type TimeInputSize = RefraktorSize;
export type TimeInputRadius = RefraktorRadius;
export type TimeInputOnChange = TimePickerOnChange;
export type TimeInputValueFormat = string;

export type TimeInputGetHourLabel = TimePickerGetHourLabel;
export type TimeInputGetMinuteLabel = TimePickerGetMinuteLabel;
export type TimeInputGetSecondLabel = TimePickerGetSecondLabel;
export type TimeInputGetPeriodLabel = TimePickerGetPeriodLabel;

export type TimeInputGetHourAriaLabel = TimePickerGetHourAriaLabel;
export type TimeInputGetMinuteAriaLabel = TimePickerGetMinuteAriaLabel;
export type TimeInputGetSecondAriaLabel = TimePickerGetSecondAriaLabel;
export type TimeInputGetPeriodAriaLabel = TimePickerGetPeriodAriaLabel;

export type TimeInputPositioning = {
    /** The placement of the dropdown relative to the input @default `bottom-start` */
    placement?: Placement;

    /** Offset distance from the input in pixels @default `4` */
    offset?: number;
};

export type TimeInputMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type TimeInputClassNames = {
    input?: string;
    dropdown?: string;
    timePicker?: string;
};

interface _TimeInputProps {
    /** Selected time (controlled), accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    value?: TimeInputValue;

    /** Initial selected time (uncontrolled), accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    defaultValue?: TimeInputValue;

    /** Callback called when selected time changes in normalized `HH:mm:ss` format (24h). */
    onChange?: TimeInputOnChange;

    /** Dropdown open state (controlled). */
    opened?: boolean;

    /** Initial dropdown open state (uncontrolled). */
    defaultOpened?: boolean;

    /** Callback called when dropdown open state changes. */
    onOpenedChange?: (opened: boolean) => void;

    /** Lower selectable bound for time-of-day, accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    minTime?: TimeInputValue;

    /** Upper selectable bound for time-of-day, accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    maxTime?: TimeInputValue;

    /** Time display mode @default `24h` */
    mode?: TimeInputMode;

    /** Custom hour label renderer. */
    getHourLabel?: TimeInputGetHourLabel;

    /** Custom minute label renderer. */
    getMinuteLabel?: TimeInputGetMinuteLabel;

    /** Custom second label renderer. */
    getSecondLabel?: TimeInputGetSecondLabel;

    /** Custom AM/PM label renderer in 12h mode. */
    getPeriodLabel?: TimeInputGetPeriodLabel;

    /** Custom aria-label generator for hour options. */
    getHourAriaLabel?: TimeInputGetHourAriaLabel;

    /** Custom aria-label generator for minute options. */
    getMinuteAriaLabel?: TimeInputGetMinuteAriaLabel;

    /** Custom aria-label generator for second options. */
    getSecondAriaLabel?: TimeInputGetSecondAriaLabel;

    /** Custom aria-label generator for period options. */
    getPeriodAriaLabel?: TimeInputGetPeriodAriaLabel;

    /** Dayjs format used to render selected time in the input @default `HH:mm:ss` */
    valueFormat?: TimeInputValueFormat;

    /** Positioning settings for the dropdown. */
    positioning?: TimeInputPositioning;

    /** Floating middleware settings. */
    middlewares?: TimeInputMiddlewares;

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

    /** Used for styling TimeInput parts. */
    classNames?: TimeInputClassNames;
}

export type TimeInputProps = _TimeInputProps &
    Omit<
        InputProps,
        "value" | "defaultValue" | "onChange" | "readOnly" | "classNames"
    >;

export interface TimeInputFactoryPayload extends FactoryPayload {
    props: TimeInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TimeInputProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TimeInputClassNames>>;
    };
}
