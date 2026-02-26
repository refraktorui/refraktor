import { ComponentPropsWithoutRef } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export type ScrollAreaClassNames = {
    root?: string;
};

export interface ScrollAreaProps extends ComponentPropsWithoutRef<"div"> {
    /** Scroll direction behavior @default `vertical` */
    orientation?: ScrollAreaOrientation;

    /** Scrollbar thickness in pixels @default `6` */
    scrollbarSize?: number;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ScrollAreaClassNames;
}

export interface ScrollAreaFactoryPayload extends FactoryPayload {
    props: ScrollAreaProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ScrollAreaProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<ScrollAreaClassNames>
        >;
    };
}
