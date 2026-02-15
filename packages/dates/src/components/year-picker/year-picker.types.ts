import { ComponentPropsWithoutRef, ReactNode } from "react";
import {
    RefraktorRadius,
    RefraktorSize,
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "@refraktor/core";

export type YearPickerValue = number;
export type YearPickerSize = RefraktorSize;
export type YearPickerRadius = RefraktorRadius;

export type YearPickerNavigationDirection = "previous" | "next";

export type YearPickerRange = {
    start: number;
    end: number;
};

export type YearPickerOnChange = (year: YearPickerValue) => void;

export type YearPickerGetYearLabel = (year: YearPickerValue) => ReactNode;

export type YearPickerGetYearAriaLabel = (
    year: YearPickerValue,
    selected: boolean
) => string;

export type YearPickerGetHeaderLabel = (range: YearPickerRange) => ReactNode;

export type YearPickerGetNavigationAriaLabel = (
    direction: YearPickerNavigationDirection,
    range: YearPickerRange
) => string;

export type YearPickerClassNames = {
    root?: string;
    header?: string;
    headerControls?: string;
    headerControl?: string;
    headerPreviousControl?: string;
    headerNextControl?: string;
    headerLabel?: string;
    grid?: string;
    year?: string;
    yearActive?: string;
};

export interface YearPickerProps
    extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
    /** Active year (controlled). */
    value?: YearPickerValue;

    /** Initial active year (uncontrolled). */
    defaultValue?: YearPickerValue;

    /** Callback called when active year changes. */
    onChange?: YearPickerOnChange;

    /** Minimum selectable year. */
    minYear?: number;

    /** Maximum selectable year. */
    maxYear?: number;

    /** Years rendered in one page @default `9` */
    yearsPerPage?: number;

    /** Grid columns used by the year list @default `3` */
    columns?: number;

    /** Whether all year controls are disabled @default `false` */
    disabled?: boolean;

    /** Component size @default `md` */
    size?: YearPickerSize;

    /** Border radius @default `default` */
    radius?: YearPickerRadius;

    /** Custom year label renderer. */
    getYearLabel?: YearPickerGetYearLabel;

    /** Custom aria-label generator for year buttons. */
    getYearAriaLabel?: YearPickerGetYearAriaLabel;

    /** Custom header label renderer for visible range. */
    getHeaderLabel?: YearPickerGetHeaderLabel;

    /** Custom aria-label generator for previous/next controls. */
    getNavigationAriaLabel?: YearPickerGetNavigationAriaLabel;

    /** Used for editing root class name. */
    className?: string;

    /** Used for styling different parts of the component. */
    classNames?: YearPickerClassNames;
}

export interface YearPickerFactoryPayload extends FactoryPayload {
    props: YearPickerProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<YearPickerProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<YearPickerClassNames>>;
    };
}
