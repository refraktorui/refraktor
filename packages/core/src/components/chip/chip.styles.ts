import { RefraktorSize } from "../../theme";
import { ChipVariant } from "./chip.types";

const sizes: Record<RefraktorSize, string> = {
    xs: "text-xs h-5 px-2 gap-1",
    sm: "text-xs h-6 px-2.5 gap-1.5",
    md: "text-sm h-7 px-3 gap-1.5",
    lg: "text-base h-8 px-3.5 gap-2",
    xl: "text-lg h-9 px-4 gap-2"
};

const variants: Record<
    ChipVariant,
    {
        idle: string;
        selected: string;
    }
> = {
    default: {
        idle: "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] border border-[var(--refraktor-border)] hover:bg-[var(--refraktor-bg-hover)]",
        selected:
            "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)] border border-[var(--refraktor-primary)]"
    },
    outline: {
        idle: "bg-transparent text-[var(--refraktor-text)] border border-[var(--refraktor-border)] hover:border-[var(--refraktor-border-hover)]",
        selected:
            "bg-[var(--refraktor-bg-subtle)] text-[var(--refraktor-text)] border border-[var(--refraktor-primary)]"
    }
};

export const getSize = (size: RefraktorSize = "sm") => sizes[size];

export const getVariant = (
    variant: ChipVariant = "default",
    selected = false
) => (selected ? variants[variant].selected : variants[variant].idle);
