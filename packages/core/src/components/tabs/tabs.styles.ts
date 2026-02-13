import { RefraktorSize } from "../../theme";
import { TabsOrientation, TabsVariant } from "./tabs.types";

type TabsSizeStyles = {
    list: string;
    tab: string;
    panel: string;
};

type TabsVariantStyles = {
    list: string;
    tab: string;
    tabActive: string;
    tabInactive: string;
    panel: string;
};

const sizes: Record<RefraktorSize, TabsSizeStyles> = {
    xs: {
        list: "p-0.5 gap-0.5",
        tab: "h-6 px-2 text-xs",
        panel: "pt-2 text-xs"
    },
    sm: {
        list: "p-0.5 gap-0.5",
        tab: "h-7 px-2.5 text-xs",
        panel: "pt-2.5 text-sm"
    },
    md: {
        list: "p-1 gap-1",
        tab: "h-8 px-3 text-sm",
        panel: "pt-3 text-sm"
    },
    lg: {
        list: "p-1 gap-1",
        tab: "h-9 px-3.5 text-base",
        panel: "pt-3.5 text-base"
    },
    xl: {
        list: "p-1.5 gap-1.5",
        tab: "h-10 px-4 text-lg",
        panel: "pt-4 text-lg"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

const variants: Record<TabsVariant, TabsVariantStyles> = {
    pills: {
        list: "bg-transparent",
        tab: "border border-transparent",
        tabActive:
            "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]",
        tabInactive:
            "text-[var(--refraktor-text-secondary)] hover:text-[var(--refraktor-text)] hover:bg-[var(--refraktor-bg-hover)]",
        panel: "text-[var(--refraktor-text)]"
    },
    underline: {
        list: "",
        tab: "border-transparent",
        tabActive: "text-[var(--refraktor-text)]",
        tabInactive:
            "text-[var(--refraktor-text-secondary)] hover:text-[var(--refraktor-text)]",
        panel: "text-[var(--refraktor-text)]"
    }
};

export function getVariant(
    variant: TabsVariant = "underline",
    orientation: TabsOrientation = "horizontal"
): TabsVariantStyles {
    const styles = variants[variant];

    if (variant !== "underline") {
        return styles;
    }

    return {
        ...styles,
        list: orientation === "horizontal" ? "gap-1" : "gap-1 pr-1",
        tab:
            orientation === "horizontal"
                ? "rounded-t-[var(--refraktor-radius-sm)] border-b-2 border-transparent"
                : "rounded-l-[var(--refraktor-radius-sm)] border-r-2 border-transparent justify-start",
        tabActive:
            orientation === "horizontal"
                ? "text-[var(--refraktor-text)] border-[var(--refraktor-primary)]"
                : "text-[var(--refraktor-text)] border-[var(--refraktor-primary)]",
        tabInactive:
            "text-[var(--refraktor-text-secondary)] hover:text-[var(--refraktor-text)] hover:border-[var(--refraktor-primary)]"
    };
}
