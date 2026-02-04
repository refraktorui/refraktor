import { RefraktorSize } from "../../theme";
import { BadgeVariant } from "./badge.types";

const sizes: Record<RefraktorSize, string> = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-0.5",
    xl: "text-lg px-3.5 py-0.5"
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

const variants: Record<BadgeVariant, string> = {
    default: "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)]",
    outline:
        "border border-[var(--refraktor-border)] text-[var(--refraktor-text)]"
};

export const getVariant = (variant: BadgeVariant = "default") =>
    variants[variant];
