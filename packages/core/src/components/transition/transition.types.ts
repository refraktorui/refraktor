import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { createComponentConfig, PolymorphicFactoryPayload } from "../../utils";

export type TransitionState = "entering" | "entered" | "exiting" | "exited";

export type Transitions =
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

export type TransitionStyles = {
    entering?: CSSProperties;
    entered?: CSSProperties;
    exiting?: CSSProperties;
    exited?: CSSProperties;
};

export interface TransitionProps
    extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    /** Controls whether the component is mounted */
    mounted?: boolean;

    /** Child element or render function */
    children: ReactNode | ((state: TransitionState) => ReactNode);

    /** Transition duration in milliseconds @default `200` */
    duration?: number;

    /** Delay before the transition starts in milliseconds @default `0` */
    delay?: number;

    /** CSS easing function @default `cubic-bezier(0.4, 0, 0.2, 1)` */
    easing?: string;

    /** The transition to use @default `fade` */
    transition?: Transitions;

    /** Custom transition styles for each state */
    styles?: TransitionStyles;

    /** CSS properties to transition (when using custom styles) */
    properties?: string[];

    /** Unmount component when exited */
    unmountOnExit?: boolean;

    /** Callback when transition enters */
    onEnter?: () => void;

    /** Callback when entered state is reached */
    onEntered?: () => void;

    /** Callback when transition exits */
    onExit?: () => void;

    /** Callback when exited state is reached */
    onExited?: () => void;

    /** Used for editing root class name */
    className?: string;

    /** Whether to use GPU acceleration for the transition @default `true` */
    useGPU?: boolean;

    /** Whether to respect reduced motion settings @default `true` */
    respectReducedMotion?: boolean;
}

export interface TransitionFactoryPayload extends PolymorphicFactoryPayload {
    props: TransitionProps;
    defaultRef: HTMLDivElement;
    defaultComponent: "div";
    compound: {
        configure: ReturnType<typeof createComponentConfig<TransitionProps>>;
    };
}
