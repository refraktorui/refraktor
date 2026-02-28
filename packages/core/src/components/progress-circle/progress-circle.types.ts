import { ComponentPropsWithoutRef } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type ProgressCircleClassNames = {
    root?: string;
    svg?: string;
    track?: string;
    bar?: string;
};

export interface ProgressCircleProps
    extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    /** Current progress value @default `0` */
    value?: number;

    /** Minimum progress value @default `0` */
    min?: number;

    /** Maximum progress value @default `100` */
    max?: number;

    /** Whether progress is indeterminate @default `false` */
    indeterminate?: boolean;

    /** Whether dash-offset transitions are animated @default `true` */
    animated?: boolean;

    /** Circle diameter in pixels @default `32` */
    size?: number;

    /** Stroke width in pixels @default `3` */
    stroke?: number;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ProgressCircleClassNames;
}

export interface ProgressCircleFactoryPayload extends FactoryPayload {
    props: ProgressCircleProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ProgressCircleProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<ProgressCircleClassNames>
        >;
    };
}
