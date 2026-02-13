import { ReactNode } from "react";
import { createComponentConfig, FactoryPayload } from "../../utils";

export interface PortalProps {
    /** Content to render */
    children: ReactNode;

    /** Whether to render content through a portal @default `true` */
    withinPortal?: boolean;

    /** Portal target element or selector, falls back to document.body */
    target?: HTMLElement | string | null;
}

export interface PortalFactoryPayload extends FactoryPayload {
    props: PortalProps;
    ref: never;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PortalProps>>;
    };
}
