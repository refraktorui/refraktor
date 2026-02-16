import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { TimelineItem } from "./timeline-item";

export type TimelineOrientation = "vertical" | "horizontal";
export type TimelineLineVariant = "solid" | "dashed" | "dotted";

export type TimelineClassNames = {
    root?: string;
    item?: string;
    bulletWrapper?: string;
    bullet?: string;
    connector?: string;
    content?: string;
    date?: string;
    title?: string;
    description?: string;
};

export interface TimelineProps extends ComponentPropsWithoutRef<"div"> {
    /** Children containing timeline items */
    children: ReactNode;

    /** Timeline orientation @default `vertical` */
    orientation?: TimelineOrientation;

    /** Shared timeline size @default `md` */
    size?: RefraktorSize;

    /** Radius used for bullets @default `full` */
    radius?: RefraktorRadius;

    /** Connector style @default `solid` */
    lineVariant?: TimelineLineVariant;

    /** Active step index. Use `-1` for no active step @default `-1` */
    active?: number;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: TimelineClassNames;
}

export interface TimelineItemProps
    extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
    /** Item date/timestamp displayed above title */
    date?: ReactNode;

    /** Item heading */
    title?: ReactNode;

    /** Custom bullet content */
    bullet?: ReactNode;

    /** Whether connector should be rendered @default `true` */
    line?: boolean;

    /** Item description/body */
    children?: ReactNode;

    /** Used for editing root class name */
    className?: string;

    /** @internal */
    __timelineIndex?: number;

    /** @internal */
    __timelineCount?: number;
}

export interface TimelineFactoryPayload extends FactoryPayload {
    props: TimelineProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TimelineProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TimelineClassNames>>;
        Item: typeof TimelineItem;
    };
}

export interface TimelineItemFactoryPayload extends FactoryPayload {
    props: TimelineItemProps;
    ref: HTMLDivElement;
}
