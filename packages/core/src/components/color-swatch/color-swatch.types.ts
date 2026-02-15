import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type ColorSwatchClassNames = {
    root?: string;
    grid?: string;
    color?: string;
    content?: string;
};

export interface ColorSwatchProps
    extends Omit<ComponentPropsWithoutRef<"div">, "color"> {
    /** Swatch color value (hex, rgb, rgba, hsl, etc.) */
    color?: string;

    /** Swatch size @default `md` */
    size?: RefraktorSize;

    /** Swatch radius @default `default` */
    radius?: RefraktorRadius;

    /** Optional centered content */
    children?: ReactNode;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ColorSwatchClassNames;
}

export interface ColorSwatchFactoryPayload extends FactoryPayload {
    props: ColorSwatchProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ColorSwatchProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<ColorSwatchClassNames>
        >;
    };
}
