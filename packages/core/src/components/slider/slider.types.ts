import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme/types";
import { FactoryPayload } from "../../utils/factory";
import { createClassNamesConfig, createComponentConfig } from "../../utils";

export type SliderClassNames = {
    root?: string;
    track?: string;
    bar?: string;
    thumb?: string;
    label?: string;
    markWrapper?: string;
    mark?: string;
    markLabel?: string;
};

export interface SliderMark {
    value: number;
    label?: ReactNode;
}

export interface SliderProps extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue" | "value"
> {
    /** Current value (controlled) */
    value?: number;

    /** Default value (uncontrolled) */
    defaultValue?: number;

    /** Callback called when value changes */
    onChange?: (value: number) => void;

    /** Callback called when user stops dragging */
    onChangeEnd?: (value: number) => void;

    /** Minimum value @default `0` */
    min?: number;

    /** Maximum value @default `100` */
    max?: number;

    /** Step value @default `1` */
    step?: number;

    /** Number of decimal places for the value */
    precision?: number;

    /** The size of the slider @default `md` */
    size?: RefraktorSize;

    /** The radius of the slider @default `full` */
    radius?: RefraktorRadius;

    /** Whether the slider is disabled @default `false` */
    disabled?: boolean;

    /** Label displayed above the slider */
    label?: ReactNode;

    /** Whether to show the label on hover/drag @default `false` */
    showLabelOnHover?: boolean;

    /** Marks to display on the slider track */
    marks?: SliderMark[];

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: SliderClassNames;
}

export interface SliderFactoryPayload extends FactoryPayload {
    props: SliderProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<SliderProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<SliderClassNames>>;
    };
}
