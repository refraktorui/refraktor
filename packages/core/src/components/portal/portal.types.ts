import { ComponentPropsWithoutRef, ReactNode } from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export interface BasePortalProps extends ComponentPropsWithoutRef<"div"> {
    /** Target element to render the portal inside. Can be an HTMLElement or a CSS selector string. */
    target?: HTMLElement | string;

    /** Whether to reuse a shared portal node for all portals with this option enabled. @default false */
    reuseTargetNode?: boolean;
}

export interface PortalProps extends BasePortalProps {
    /** The content to render inside the portal */
    children: ReactNode;
}

export type PortalClassNames = {
    root?: string;
};

export interface PortalFactoryPayload extends FactoryPayload {
    props: PortalProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PortalProps>>;
    };
}
