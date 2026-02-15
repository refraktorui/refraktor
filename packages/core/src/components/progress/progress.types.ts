import { ComponentPropsWithoutRef } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type ProgressClassNames = {
    root?: string;
    track?: string;
    bar?: string;
};

export interface ProgressProps
    extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    /** Current progress value @default `0` */
    value?: number;

    /** Minimum progress value @default `0` */
    min?: number;

    /** Maximum progress value @default `100` */
    max?: number;

    /** Whether progress is indeterminate @default `false` */
    indeterminate?: boolean;

    /** Whether width transitions are animated @default `true` */
    animated?: boolean;

    /** Track size @default `md` */
    size?: RefraktorSize;

    /** Track radius @default `full` */
    radius?: RefraktorRadius;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ProgressClassNames;
}

export interface ProgressFactoryPayload extends FactoryPayload {
    props: ProgressProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ProgressProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<ProgressClassNames>>;
    };
}
