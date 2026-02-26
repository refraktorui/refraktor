import { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import { TransitionProps } from "../transition";
import { DrawerRoot } from "./drawer-root";
import { DrawerOverlay } from "./drawer-overlay";
import { DrawerContent } from "./drawer-content";
import { DrawerHeader } from "./drawer-header";
import { DrawerBody } from "./drawer-body";
import { DrawerClose } from "./drawer-close";

export type DrawerPosition = "left" | "right" | "top" | "bottom";

export type DrawerClassNames = {
    root?: string;
    overlay?: string;
    content?: string;
    header?: string;
    body?: string;
    close?: string;
};

export interface DrawerRootProps extends ComponentPropsWithoutRef<"div"> {
    /** Children containing drawer subcomponents */
    children?: ReactNode;

    /** State of the drawer (controlled) */
    opened?: boolean;

    /** Initial state of the drawer (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when drawer state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Whether to close drawer on overlay/outside click @default `true` */
    closeOnClickOutside?: boolean;

    /** Whether to close drawer on Escape key @default `true` */
    closeOnEscape?: boolean;

    /** Whether to lock body scroll while opened @default `true` */
    lockScroll?: boolean;

    /** Whether to render overlay/content inside portal @default `true` */
    withinPortal?: boolean;

    /** Radius for drawer content @default `none` */
    radius?: RefraktorRadius;

    /** Side where drawer appears @default `right` */
    position?: DrawerPosition;

    /** Drawer size scale (width for left/right, height for top/bottom) @default `md` */
    size?: RefraktorSize;

    /** Whether to trap focus within the drawer @default `true` */
    trapFocus?: boolean;

    /** Whether to return focus to trigger after close @default `true` */
    returnFocus?: boolean;

    /** Transition props for overlay/content, uses Transition internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: DrawerClassNames;
}

export interface DrawerProps extends Omit<DrawerRootProps, "title"> {
    /** Title text rendered in the header */
    title?: ReactNode;

    /** Whether to render the overlay @default `true` */
    withOverlay?: boolean;

    /** Whether to show the close button in the header @default `true` */
    withCloseButton?: boolean;

    /** Props passed to the Overlay subcomponent */
    overlayProps?: DrawerOverlayProps;
}

export interface DrawerOverlayProps extends ComponentPropsWithoutRef<"div"> {
    /** Whether clicking the overlay closes drawer @default `true` */
    closeOnClick?: boolean;

    /** Overlay background opacity @default `0.5` */
    backgroundOpacity?: number;

    /** Backdrop blur amount in px (or any CSS length) @default `0` */
    blur?: number | string;

    /** Used for editing root class name */
    className?: string;
}

export interface DrawerContentProps extends ComponentPropsWithoutRef<"div"> {
    /** Drawer body content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface DrawerHeaderProps extends ComponentPropsWithoutRef<"div"> {
    /** Header content */
    children?: ReactNode;

    /** Shorthand header text */
    text?: ReactNode;

    /** Whether to show close button inside header @default `true` */
    withClose?: boolean;

    /** Used for editing root class name */
    className?: string;
}

export interface DrawerBodyProps extends ComponentPropsWithoutRef<"div"> {
    /** Body content */
    children?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface DrawerCloseProps extends Omit<
    ComponentPropsWithoutRef<"button">,
    "onClick"
> {
    /** Optional close content (defaults to `x`) */
    children?: ReactNode;

    /** Click callback fired before closing */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /** Used for editing root class name */
    className?: string;
}

export interface DrawerFactoryPayload extends FactoryPayload {
    props: DrawerProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<DrawerProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<DrawerClassNames>>;
        Root: typeof DrawerRoot;
        Overlay: typeof DrawerOverlay;
        Content: typeof DrawerContent;
        Header: typeof DrawerHeader;
        Body: typeof DrawerBody;
        Close: typeof DrawerClose;
    };
}

export interface DrawerRootFactoryPayload extends FactoryPayload {
    props: DrawerRootProps;
    ref: HTMLDivElement;
}

export interface DrawerOverlayFactoryPayload extends FactoryPayload {
    props: DrawerOverlayProps;
    ref: HTMLDivElement;
}

export interface DrawerContentFactoryPayload extends FactoryPayload {
    props: DrawerContentProps;
    ref: HTMLDivElement;
}

export interface DrawerHeaderFactoryPayload extends FactoryPayload {
    props: DrawerHeaderProps;
    ref: HTMLDivElement;
}

export interface DrawerBodyFactoryPayload extends FactoryPayload {
    props: DrawerBodyProps;
    ref: HTMLDivElement;
}

export interface DrawerCloseFactoryPayload extends FactoryPayload {
    props: DrawerCloseProps;
    ref: HTMLButtonElement;
}
