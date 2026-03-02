import type { Placement, Strategy } from "@floating-ui/react";
import { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import {
    RefraktorRadius,
    RefraktorSize,
    InputVariant,
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "@refraktor/core";

export type TimePickerValue = string;
export type TimePickerFormat = "12h" | "24h";
export type TimePickerAmPmLabels = { am: string; pm: string };

export type TimePickerClassNames = {
    root?: string;
    fieldsWrapper?: string;
    field?: string;
    separator?: string;
    amPmInput?: string;
    dropdown?: string;
    dropdownColumn?: string;
    dropdownColumnLabel?: string;
    dropdownOption?: string;
    dropdownOptionActive?: string;
};

export type TimePickerPopoverProps = {
    /** Dropdown placement relative to the input @default `bottom-start` */
    placement?: Placement;
    /** Offset distance from the input in pixels @default `4` */
    offset?: number;
};

interface _TimePickerProps {
    /** Controlled time value in 24h format (`HH:mm` or `HH:mm:ss`). Empty string for no value. */
    value?: TimePickerValue;

    /** Uncontrolled initial time value in 24h format (`HH:mm` or `HH:mm:ss`). */
    defaultValue?: TimePickerValue;

    /** Called when the time value changes. Fires when all visible fields are filled, or all are cleared. */
    onChange?: (value: TimePickerValue) => void;

    /** Time display format @default `"24h"` */
    format?: TimePickerFormat;

    /** Show seconds field @default `false` */
    withSeconds?: boolean;

    /** Show scrollable dropdown with time options @default `false` */
    withDropdown?: boolean;

    /** Show clear button in the right section @default `false` */
    clearable?: boolean;

    /** Minimum selectable time in 24h format (`HH:mm` or `HH:mm:ss`) */
    min?: TimePickerValue;

    /** Maximum selectable time in 24h format (`HH:mm` or `HH:mm:ss`) */
    max?: TimePickerValue;

    /** Step for hour increment/decrement and dropdown generation @default `1` */
    hoursStep?: number;

    /** Step for minute increment/decrement and dropdown generation @default `1` */
    minutesStep?: number;

    /** Step for second increment/decrement and dropdown generation @default `1` */
    secondsStep?: number;

    /** Custom AM/PM labels @default `{ am: "AM", pm: "PM" }` */
    amPmLabels?: TimePickerAmPmLabels;

    /** Whether the input is disabled @default `false` */
    disabled?: boolean;

    /** Whether the input is read-only @default `false` */
    readOnly?: boolean;

    /** Input variant @default `"default"` */
    variant?: InputVariant;

    /** Component size @default `"md"` */
    size?: RefraktorSize;

    /** Border radius @default `"default"` */
    radius?: RefraktorRadius;

    /** Label text */
    label?: ReactNode;

    /** Description text displayed below the label */
    description?: ReactNode;

    /** Error message */
    error?: ReactNode;

    /** Whether the field is required */
    required?: boolean;

    /** Display an asterisk next to the label */
    withAsterisk?: boolean;

    /** Left section content */
    leftSection?: ReactNode;

    /** Right section content (overridden by clearable when value is set) */
    rightSection?: ReactNode;

    /** Ref for the hours input element */
    hoursRef?: Ref<HTMLInputElement>;

    /** Ref for the minutes input element */
    minutesRef?: Ref<HTMLInputElement>;

    /** Ref for the seconds input element */
    secondsRef?: Ref<HTMLInputElement>;

    /** Ref for the AM/PM select element */
    amPmRef?: Ref<HTMLInputElement>;

    /** Aria label for hours input */
    hoursInputLabel?: string;

    /** Aria label for minutes input */
    minutesInputLabel?: string;

    /** Aria label for seconds input */
    secondsInputLabel?: string;

    /** Aria label for AM/PM input */
    amPmInputLabel?: string;

    /** Popover props for the dropdown */
    popoverProps?: TimePickerPopoverProps;

    /** CSS positioning strategy used by Floating UI @default `fixed` */
    strategy?: Strategy;

    /** Called when any field gains focus */
    onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;

    /** Called when all fields lose focus */
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;

    /** Used for styling different parts of the component */
    classNames?: TimePickerClassNames;
}

export type TimePickerProps = _TimePickerProps &
    Omit<
        ComponentPropsWithoutRef<"div">,
        | "onChange"
        | "value"
        | "defaultValue"
        | "onFocus"
        | "onBlur"
    >;

export interface TimePickerFactoryPayload extends FactoryPayload {
    props: TimePickerProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TimePickerProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TimePickerClassNames>>;
    };
}
