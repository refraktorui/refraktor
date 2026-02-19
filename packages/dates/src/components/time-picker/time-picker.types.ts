import { ComponentPropsWithoutRef, ReactNode } from "react";
import {
    RefraktorRadius,
    RefraktorSize,
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "@refraktor/core";

export type TimePickerValue = string;
export type TimePickerMode = "12h" | "24h";
export type TimePickerPeriod = "am" | "pm";
export type TimePickerSize = RefraktorSize;
export type TimePickerRadius = RefraktorRadius;

export type TimePickerOnChange = (value: TimePickerValue) => void;

export type TimePickerGetHourLabel = (
    hour: number,
    mode: TimePickerMode
) => ReactNode;

export type TimePickerGetMinuteLabel = (minute: number) => ReactNode;

export type TimePickerGetSecondLabel = (second: number) => ReactNode;

export type TimePickerGetPeriodLabel = (period: TimePickerPeriod) => ReactNode;

export type TimePickerGetHourAriaLabel = (
    hour: number,
    mode: TimePickerMode,
    selected: boolean
) => string;

export type TimePickerGetMinuteAriaLabel = (
    minute: number,
    selected: boolean
) => string;

export type TimePickerGetSecondAriaLabel = (
    second: number,
    selected: boolean
) => string;

export type TimePickerGetPeriodAriaLabel = (
    period: TimePickerPeriod,
    selected: boolean
) => string;

export type TimePickerClassNames = {
    root?: string;
    grid?: string;
    section?: string;
    sectionLabel?: string;
    list?: string;
    option?: string;
    optionActive?: string;
    optionDisabled?: string;
    hourSection?: string;
    minuteSection?: string;
    secondSection?: string;
    periodSection?: string;
};

export interface TimePickerProps
    extends Omit<
        ComponentPropsWithoutRef<"div">,
        "onChange" | "value" | "defaultValue"
    > {
    /** Active time (controlled), accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    value?: TimePickerValue;

    /** Initial active time (uncontrolled), accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    defaultValue?: TimePickerValue;

    /** Callback called when active time changes in normalized `HH:mm:ss` format (24h). */
    onChange?: TimePickerOnChange;

    /** Lower selectable bound for time-of-day, accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    minTime?: TimePickerValue;

    /** Upper selectable bound for time-of-day, accepts `H:mm:ss` or `HH:mm:ss` (24h). */
    maxTime?: TimePickerValue;

    /** Time display mode @default `24h` */
    mode?: TimePickerMode;

    /** Whether all controls are disabled @default `false` */
    disabled?: boolean;

    /** Component size @default `md` */
    size?: TimePickerSize;

    /** Border radius @default `default` */
    radius?: TimePickerRadius;

    /** Custom hour label renderer. */
    getHourLabel?: TimePickerGetHourLabel;

    /** Custom minute label renderer. */
    getMinuteLabel?: TimePickerGetMinuteLabel;

    /** Custom second label renderer. */
    getSecondLabel?: TimePickerGetSecondLabel;

    /** Custom AM/PM label renderer in 12h mode. */
    getPeriodLabel?: TimePickerGetPeriodLabel;

    /** Custom aria-label generator for hour options. */
    getHourAriaLabel?: TimePickerGetHourAriaLabel;

    /** Custom aria-label generator for minute options. */
    getMinuteAriaLabel?: TimePickerGetMinuteAriaLabel;

    /** Custom aria-label generator for second options. */
    getSecondAriaLabel?: TimePickerGetSecondAriaLabel;

    /** Custom aria-label generator for period options. */
    getPeriodAriaLabel?: TimePickerGetPeriodAriaLabel;

    /** Used for editing root class name. */
    className?: string;

    /** Used for styling different parts of the component. */
    classNames?: TimePickerClassNames;
}

export interface TimePickerFactoryPayload extends FactoryPayload {
    props: TimePickerProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TimePickerProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TimePickerClassNames>>;
    };
}
