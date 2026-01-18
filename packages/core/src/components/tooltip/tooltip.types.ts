import { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
    FlipOptions,
    InlineOptions,
    Placement,
    ShiftOptions
} from "@floating-ui/react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { TransitionProps } from "../transition";
import { RefraktorRadius } from "../../theme";

export type TooltipClassNames = {
    root?: string;
    trigger?: string;
    content?: string;
    arrow?: string;
};

export type TooltipPositioning = {
    /** The placement of the tooltip relative to the trigger element @default `top` */
    placement?: Placement;

    /** Offset distance from the trigger element in pixels @default `8` */
    offset?: number;
};

export type TooltipMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type TooltipTrigger = "hover" | "focus";

export interface TooltipProps extends Omit<
    ComponentPropsWithoutRef<"div">,
    "content"
> {
    /** The trigger element that activates the tooltip */
    children: ReactNode;

    /** Content to display inside the tooltip */
    content: ReactNode;

    /** State of the tooltip (controlled) */
    opened?: boolean;

    /** Initial state of the tooltip (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when the tooltip state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Positioning settings for the tooltip */
    positioning?: TooltipPositioning;

    /** Middlewares settings for the tooltip */
    middlewares?: TooltipMiddlewares;

    /** Whether the tooltip is disabled @default `false` */
    disabled?: boolean;

    /** Trigger type for the tooltip @default `hover` */
    trigger?: TooltipTrigger;

    /** Delay in milliseconds before the tooltip opens @default `0` */
    openDelay?: number;

    /** Delay in milliseconds before the tooltip closes @default `0` */
    closeDelay?: number;

    /** Whether to show the arrow for the tooltip @default `false` */
    showArrow?: boolean;

    /** Transition props for the tooltip content, uses Transition component internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Radius for the tooltip content @default `default` */
    radius?: RefraktorRadius;

    /** Whether to render the tooltip within a portal @default `true` */
    withinPortal?: boolean;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: TooltipClassNames;
}

export interface TooltipFactoryPayload extends FactoryPayload {
    props: TooltipProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TooltipProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<TooltipClassNames>
        >;
    };
}
