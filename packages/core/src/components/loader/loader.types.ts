import { ComponentPropsWithoutRef } from "react";
import { createComponentConfig, FactoryPayload } from "../../utils";

export interface LoaderProps extends ComponentPropsWithoutRef<"div"> {
    /** The size of the loader @default `32` */
    size?: number;

    /** The color of the loader @default `var(--refraktor-primary)` */
    color?: string;

    /** The speed of the loader @default `1` */
    speed?: number;

    /** The size of the stroke @default `3` */
    stroke?: number;

    /** The length of the stroke @default `0.6` */
    strokeLength?: number;

    /** The opacity of the background @default `0.1` */
    bgOpacity?: number;

    /** Used for editing root class name */
    className?: string;
}

export interface LoaderFactoryPayload extends FactoryPayload {
    props: LoaderProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<LoaderProps>>;
    };
}
