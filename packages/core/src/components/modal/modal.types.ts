import { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { RefraktorRadius } from "../../theme";
import { TransitionProps } from "../transition";
import { ModalRoot } from "./modal-root";
import { ModalOverlay } from "./modal-overlay";
import { ModalContent } from "./modal-content";
import { ModalHeader } from "./modal-header";
import { ModalBody } from "./modal-body";
import { ModalClose } from "./modal-close";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export type ModalClassNames = {
    root?: string;
    overlay?: string;
    content?: string;
    header?: string;
    body?: string;
    close?: string;
};

export interface ModalRootProps extends ComponentPropsWithoutRef<"div"> {
    /** Children containing modal subcomponents */
    children?: ReactNode;

    /** State of the modal (controlled) */
    opened?: boolean;

    /** Initial state of the modal (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when modal state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Whether to close modal on overlay/outside click @default `true` */
    closeOnClickOutside?: boolean;

    /** Whether to close modal on Escape key @default `true` */
    closeOnEscape?: boolean;

    /** Whether to lock body scroll while opened @default `true` */
    lockScroll?: boolean;

    /** Whether to render overlay/content inside portal @default `true` */
    withinPortal?: boolean;

    /** Radius for modal content @default `md` */
    radius?: RefraktorRadius;

    /** Modal content width @default `md` */
    size?: ModalSize;

    /** Whether to center modal vertically @default `true` */
    centered?: boolean;

    /** Whether to trap focus within the modal @default `true` */
    trapFocus?: boolean;

    /** Whether to return focus to trigger after close @default `true` */
    returnFocus?: boolean;

    /** Transition props for overlay/content, uses Transition internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ModalClassNames;
}

export interface ModalProps extends Omit<ModalRootProps, "title"> {
    /** Title text rendered in the header */
    title?: ReactNode;

    /** Whether to render the overlay @default `true` */
    withOverlay?: boolean;

    /** Whether to show the close button in the header @default `true` */
    withCloseButton?: boolean;

    /** Props passed to the Overlay subcomponent */
    overlayProps?: ModalOverlayProps;
}

export interface ModalOverlayProps extends ComponentPropsWithoutRef<"div"> {
    /** Whether clicking the overlay closes modal @default `true` */
    closeOnClick?: boolean;

    /** Overlay background opacity @default `0.5` */
    backgroundOpacity?: number;

    /** Backdrop blur amount in px (or any CSS length) @default `0` */
    blur?: number | string;

    /** Used for editing root class name */
    className?: string;
}

export interface ModalContentProps extends ComponentPropsWithoutRef<"div"> {
    /** Modal body content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface ModalHeaderProps extends ComponentPropsWithoutRef<"div"> {
    /** Header content */
    children?: ReactNode;

    /** Whether to show close button inside header @default `true` */
    withClose?: boolean;

    /** Used for editing root class name */
    className?: string;
}

export interface ModalBodyProps extends ComponentPropsWithoutRef<"div"> {
    /** Body content */
    children?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface ModalCloseProps extends Omit<
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

export interface ModalFactoryPayload extends FactoryPayload {
    props: ModalProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ModalProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<ModalClassNames>>;
        Root: typeof ModalRoot;
        Overlay: typeof ModalOverlay;
        Content: typeof ModalContent;
        Header: typeof ModalHeader;
        Body: typeof ModalBody;
        Close: typeof ModalClose;
    };
}

export interface ModalRootFactoryPayload extends FactoryPayload {
    props: ModalRootProps;
    ref: HTMLDivElement;
}

export interface ModalOverlayFactoryPayload extends FactoryPayload {
    props: ModalOverlayProps;
    ref: HTMLDivElement;
}

export interface ModalContentFactoryPayload extends FactoryPayload {
    props: ModalContentProps;
    ref: HTMLDivElement;
}

export interface ModalHeaderFactoryPayload extends FactoryPayload {
    props: ModalHeaderProps;
    ref: HTMLDivElement;
}

export interface ModalBodyFactoryPayload extends FactoryPayload {
    props: ModalBodyProps;
    ref: HTMLDivElement;
}

export interface ModalCloseFactoryPayload extends FactoryPayload {
    props: ModalCloseProps;
    ref: HTMLButtonElement;
}
