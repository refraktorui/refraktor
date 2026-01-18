import { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
    FlipOptions,
    InlineOptions,
    Placement,
    ShiftOptions
} from "@floating-ui/react";
import { TransitionProps } from "../transition";
import { RefraktorRadius } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { PopoverTrigger } from "./popover-trigger";
import { PopoverDropdown } from "./popover-dropdown";

export type PopoverClassNames = {
    root?: string;
    trigger?: string;
    dropdown?: string;
    arrow?: string;
};

export type PopoverPositioning = {
    /** The placement of the popover relative to the trigger element @default `bottom` */
    placement?: Placement;

    /** Offset distance from the trigger element in pixels @default `8` */
    offset?: number;
};

export type PopoverMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type PopoverTrigger = "click" | "hover" | "focus";

export interface PopoverProps extends ComponentPropsWithoutRef<"div"> {
    /** Children containing subcomponents */
    children: ReactNode;

    /** State of the popover (controlled) */
    opened?: boolean;

    /** Initial state of the popover (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when the popover state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Positioning settings for the popover */
    positioning?: PopoverPositioning;

    /** Middlewares settings for the popover */
    middlewares?: PopoverMiddlewares;

    /** Whether the popover is disabled @default `false` */
    disabled?: boolean;

    /** Trigger type for the popover @default `click` */
    trigger?: PopoverTrigger;

    /** Delay in milliseconds before the popover opens @default `0` */
    openDelay?: number;

    /** Delay in milliseconds before the popover closes @default `0` */
    closeDelay?: number;

    /** Whether to show the arrow for the popover @default `false` */
    showArrow?: boolean;

    /** Transition props for the popover dropdown, uses Transition component internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Radius for the popover dropdown @default `default` */
    radius?: RefraktorRadius;

    /** Whether to render the popover within a portal @default `true` */
    withinPortal?: boolean;

    /** Whether to close on click outside @default `true` */
    closeOnClickOutside?: boolean;

    /** Whether to close on escape key @default `true` */
    closeOnEscape?: boolean;

    /** Whether to trap focus within the popover @default `false` */
    trapFocus?: boolean;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: PopoverClassNames;
}

export interface PopoverTriggerProps extends ComponentPropsWithoutRef<"div"> {
    /** The trigger element */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface PopoverDropdownProps extends ComponentPropsWithoutRef<"div"> {
    /** Content to display inside the dropdown */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface PopoverFactoryPayload extends FactoryPayload {
    props: PopoverProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PopoverProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<PopoverClassNames>
        >;
        Trigger: typeof PopoverTrigger;
        Dropdown: typeof PopoverDropdown;
    };
}

export interface PopoverTriggerFactoryPayload extends FactoryPayload {
    props: PopoverTriggerProps;
    ref: HTMLDivElement;
}

export interface PopoverDropdownFactoryPayload extends FactoryPayload {
    props: PopoverDropdownProps;
    ref: HTMLDivElement;
}
