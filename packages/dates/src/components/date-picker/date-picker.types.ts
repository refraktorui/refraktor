import { ComponentPropsWithoutRef, ReactNode } from "react";
import {
    RefraktorRadius,
    RefraktorSize,
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "@refraktor/core";
import type {
    MonthPickerGetHeaderLabel,
    MonthPickerGetMonthAriaLabel,
    MonthPickerGetMonthLabel,
    MonthPickerGetNavigationAriaLabel
} from "../month-picker";

export type DatePickerValue = Date;
export type DatePickerSize = RefraktorSize;
export type DatePickerRadius = RefraktorRadius;

export type DatePickerNavigationDirection = "previous" | "next";

export type DatePickerOnChange = (value: DatePickerValue) => void;

export type DatePickerGetDayLabel = (value: Date) => ReactNode;

export type DatePickerGetDayAriaLabel = (
    value: Date,
    selected: boolean
) => string;

export type DatePickerGetWeekdayLabel = (
    dayOfWeek: number,
    label: string
) => ReactNode;

export type DatePickerGetHeaderLabel = (
    month: number,
    year: number,
    value: Date
) => ReactNode;

export type DatePickerGetNavigationAriaLabel = (
    direction: DatePickerNavigationDirection,
    value: Date
) => string;

export type DatePickerClassNames = {
    root?: string;
    header?: string;
    headerControls?: string;
    headerControl?: string;
    headerPreviousControl?: string;
    headerNextControl?: string;
    headerLabel?: string;
    weekdays?: string;
    weekday?: string;
    grid?: string;
    day?: string;
    dayOutside?: string;
    dayToday?: string;
    daySelected?: string;
    dayDisabled?: string;
    monthPicker?: string;
};

export interface DatePickerProps
    extends Omit<
        ComponentPropsWithoutRef<"div">,
        "onChange" | "value" | "defaultValue"
    > {
    /** Active date (controlled). */
    value?: DatePickerValue;

    /** Initial active date (uncontrolled). */
    defaultValue?: DatePickerValue;

    /** Callback called when active date changes. */
    onChange?: DatePickerOnChange;

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

    /** Whether all controls are disabled @default `false` */
    disabled?: boolean;

    /** Component size @default `md` */
    size?: DatePickerSize;

    /** Border radius @default `default` */
    radius?: DatePickerRadius;

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

    /** Used for editing root class name. */
    className?: string;

    /** Used for styling different parts of the component. */
    classNames?: DatePickerClassNames;
}

export interface DatePickerFactoryPayload extends FactoryPayload {
    props: DatePickerProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<DatePickerProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<DatePickerClassNames>>;
    };
}
