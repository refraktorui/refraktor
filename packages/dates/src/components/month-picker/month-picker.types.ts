import { ComponentPropsWithoutRef, ReactNode } from "react";
import {
    RefraktorRadius,
    RefraktorSize,
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "@refraktor/core";

export type MonthPickerValue = Date;
export type MonthPickerSize = RefraktorSize;
export type MonthPickerRadius = RefraktorRadius;

export type MonthPickerNavigationDirection = "previous" | "next";

export type MonthPickerOnChange = (value: MonthPickerValue) => void;

export type MonthPickerGetMonthLabel = (
    month: number,
    year: number,
    value: Date
) => ReactNode;

export type MonthPickerGetMonthAriaLabel = (
    month: number,
    year: number,
    selected: boolean
) => string;

export type MonthPickerGetHeaderLabel = (year: number) => ReactNode;

export type MonthPickerGetNavigationAriaLabel = (
    direction: MonthPickerNavigationDirection,
    year: number
) => string;

export type MonthPickerClassNames = {
    root?: string;
    header?: string;
    headerControls?: string;
    headerControl?: string;
    headerPreviousControl?: string;
    headerNextControl?: string;
    headerLabel?: string;
    grid?: string;
    month?: string;
    monthActive?: string;
    yearPicker?: string;
};

export interface MonthPickerProps
    extends Omit<
        ComponentPropsWithoutRef<"div">,
        "onChange" | "value" | "defaultValue"
    > {
    /** Active month (controlled). */
    value?: MonthPickerValue;

    /** Initial active month (uncontrolled). */
    defaultValue?: MonthPickerValue;

    /** Callback called when active month changes. */
    onChange?: MonthPickerOnChange;

    /** Minimum available year in month and year views. */
    minYear?: number;

    /** Maximum available year in month and year views. */
    maxYear?: number;

    /** Grid columns used by the month list @default `3` */
    columns?: number;

    /** Year picker years rendered in one page @default `9` */
    yearPickerYearsPerPage?: number;

    /** Year picker columns @default `3` */
    yearPickerColumns?: number;

    /** Whether all controls are disabled @default `false` */
    disabled?: boolean;

    /** Component size @default `md` */
    size?: MonthPickerSize;

    /** Border radius @default `default` */
    radius?: MonthPickerRadius;

    /** Custom month label renderer. */
    getMonthLabel?: MonthPickerGetMonthLabel;

    /** Custom aria-label generator for month buttons. */
    getMonthAriaLabel?: MonthPickerGetMonthAriaLabel;

    /** Custom header label renderer for visible year. */
    getHeaderLabel?: MonthPickerGetHeaderLabel;

    /** Custom aria-label generator for previous/next controls. */
    getNavigationAriaLabel?: MonthPickerGetNavigationAriaLabel;

    /** Used for editing root class name. */
    className?: string;

    /** Used for styling different parts of the component. */
    classNames?: MonthPickerClassNames;
}

export interface MonthPickerFactoryPayload extends FactoryPayload {
    props: MonthPickerProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<MonthPickerProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<MonthPickerClassNames>
        >;
    };
}
