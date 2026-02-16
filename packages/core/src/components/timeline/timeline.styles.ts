import { RefraktorSize } from "../../theme";
import { TimelineLineVariant, TimelineOrientation } from "./timeline.types";

type TimelineSizeStyles = {
    rootGap: string;
    itemGap: string;
    itemSpacing: string;
    connectorExtend: string;
    bulletWrapper: string;
    bullet: string;
    contentGap: string;
    date: string;
    title: string;
    description: string;
};

type TimelineStatusStyles = {
    bullet: string;
    date: string;
    title: string;
    description: string;
    connectorColor: string;
};

const sizes: Record<RefraktorSize, TimelineSizeStyles> = {
    xs: {
        rootGap: "gap-3",
        itemGap: "gap-2",
        itemSpacing: "pb-3",
        connectorExtend: "-mb-3",
        bulletWrapper: "w-4",
        bullet: "size-4 text-[9px]",
        contentGap: "gap-1",
        date: "text-[10px]",
        title: "text-xs",
        description: "text-xs"
    },
    sm: {
        rootGap: "gap-3",
        itemGap: "gap-2.5",
        itemSpacing: "pb-3",
        connectorExtend: "-mb-3",
        bulletWrapper: "w-5",
        bullet: "size-4.5 text-[10px]",
        contentGap: "gap-1",
        date: "text-[11px]",
        title: "text-xs",
        description: "text-xs"
    },
    md: {
        rootGap: "gap-4",
        itemGap: "gap-3",
        itemSpacing: "pb-4",
        connectorExtend: "-mb-4",
        bulletWrapper: "w-6",
        bullet: "size-5 text-xs",
        contentGap: "gap-1.5",
        date: "text-xs",
        title: "text-sm",
        description: "text-xs"
    },
    lg: {
        rootGap: "gap-4",
        itemGap: "gap-3.5",
        itemSpacing: "pb-4",
        connectorExtend: "-mb-4",
        bulletWrapper: "w-7",
        bullet: "size-6 text-sm",
        contentGap: "gap-1.5",
        date: "text-sm",
        title: "text-base",
        description: "text-sm"
    },
    xl: {
        rootGap: "gap-5",
        itemGap: "gap-4",
        itemSpacing: "pb-5",
        connectorExtend: "-mb-5",
        bulletWrapper: "w-8",
        bullet: "size-7 text-base",
        contentGap: "gap-2",
        date: "text-base",
        title: "text-lg",
        description: "text-base"
    }
};

const statuses = {
    default: {
        bullet: "border border-[var(--refraktor-border)] text-[var(--refraktor-text-secondary)]",
        date: "text-[var(--refraktor-text-secondary)]",
        title: "text-[var(--refraktor-text)]",
        description: "text-[var(--refraktor-text-secondary)]",
        connectorColor: "var(--refraktor-border)"
    },
    active: {
        bullet: "border border-[var(--refraktor-primary)] text-[var(--refraktor-text)]",
        date: "text-[var(--refraktor-text-secondary)]",
        title: "text-[var(--refraktor-text)]",
        description: "text-[var(--refraktor-text-secondary)]",
        connectorColor: "var(--refraktor-primary)"
    }
} satisfies Record<"default" | "active", TimelineStatusStyles>;

export const getSize = (size: RefraktorSize = "md") => sizes[size];

export const getStatus = (active: boolean) =>
    active ? statuses.active : statuses.default;

export function getConnector(
    lineVariant: TimelineLineVariant = "solid",
    orientation: TimelineOrientation = "vertical"
) {
    if (orientation === "vertical") {
        if (lineVariant === "dashed") {
            return "w-0 flex-1 border-l border-dashed border-[var(--refraktor-timeline-connector-color)]";
        }

        if (lineVariant === "dotted") {
            return "w-0 flex-1 border-l border-dotted border-[var(--refraktor-timeline-connector-color)]";
        }

        return "w-px flex-1 bg-[var(--refraktor-timeline-connector-color)]";
    }

    if (lineVariant === "dashed") {
        return "ml-2 h-0 flex-1 border-t border-dashed border-[var(--refraktor-timeline-connector-color)]";
    }

    if (lineVariant === "dotted") {
        return "ml-2 h-0 flex-1 border-t border-dotted border-[var(--refraktor-timeline-connector-color)]";
    }

    return "ml-2 h-px flex-1 bg-[var(--refraktor-timeline-connector-color)]";
}
