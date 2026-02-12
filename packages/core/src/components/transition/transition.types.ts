import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { createComponentConfig, PolymorphicFactoryPayload } from "../../utils";

export type TransitionState = "entering" | "entered" | "exiting" | "exited";
export type TransitionDirection = "enter" | "exit";

export type TransitionPreset =
    | "fade"
    | "scale"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "zoom"
    | "collapse"
    | "blur"
    | "rotate";

export type TransitionDefinition = {
    enterFrom?: CSSProperties;
    enterTo?: CSSProperties;
    exitFrom?: CSSProperties;
    exitTo?: CSSProperties;
    properties?: string[];
};

export type TransitionTimingValue<T> =
    | T
    | Partial<Record<TransitionDirection, T>>;

export type TransitionMotionPreference = "respect" | "always" | "never";

export interface TransitionProps
    extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    /** Controls whether the component is mounted */
    mounted: boolean;

    /** Child element or render function */
    children: ReactNode | ((state: TransitionState) => ReactNode);

    /** Preset name or custom transition definition @default `fade` */
    transition?: TransitionPreset | TransitionDefinition;

    /** Enter/exit duration in milliseconds @default `200` */
    duration?: TransitionTimingValue<number>;

    /** Enter/exit delay in milliseconds @default `0` */
    delay?: TransitionTimingValue<number>;

    /** Enter/exit easing function @default `cubic-bezier(0.4, 0, 0.2, 1)` */
    easing?: TransitionTimingValue<string>;

    /** Transitioned CSS properties (`auto` uses transition definition metadata) @default `auto` */
    properties?: "auto" | string[];

    /** Keep element mounted after exit @default `false` */
    keepMounted?: boolean;

    /** Animate on initial mount @default `true` */
    appear?: boolean;

    /** Skip animations and jump to end states @default `false` */
    immediate?: boolean;

    /** Motion preference behavior @default `respect` */
    reduceMotion?: TransitionMotionPreference;

    /** Callback when entering starts */
    onEnterStart?: () => void;

    /** Callback when entering completes */
    onEnterEnd?: () => void;

    /** Callback when exiting starts */
    onExitStart?: () => void;

    /** Callback when exiting completes */
    onExitEnd?: () => void;

    /** Callback when transition state changes */
    onStateChange?: (state: TransitionState) => void;

    /** Used for editing root class name */
    className?: string;

    /** Whether to use GPU acceleration for the transition @default `true` */
    useGPU?: boolean;
}

export interface TransitionFactoryPayload extends PolymorphicFactoryPayload {
    props: TransitionProps;
    defaultRef: HTMLDivElement;
    defaultComponent: "div";
    compound: {
        configure: ReturnType<typeof createComponentConfig<TransitionProps>>;
    };
}
