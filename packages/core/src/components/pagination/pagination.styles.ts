import { RefraktorSize } from "../../theme";
import { PaginationVariant } from "./pagination.types";

type PaginationSizeStyles = {
    list: string;
    item: string;
    dots: string;
    iconSize: number;
};

type PaginationVariantStyles = {
    base: string;
    active: string;
    inactive: string;
};

const sizes: Record<RefraktorSize, PaginationSizeStyles> = {
    xs: {
        list: "gap-1",
        item: "h-6 min-w-6 px-1.5 text-xs",
        dots: "h-6 min-w-6 px-1 text-xs",
        iconSize: 12
    },
    sm: {
        list: "gap-1",
        item: "h-7 min-w-7 px-2 text-xs",
        dots: "h-7 min-w-7 px-1.5 text-xs",
        iconSize: 14
    },
    md: {
        list: "gap-1.5",
        item: "h-8 min-w-8 px-2.5 text-sm",
        dots: "h-8 min-w-8 px-2 text-sm",
        iconSize: 16
    },
    lg: {
        list: "gap-1.5",
        item: "h-9 min-w-9 px-3 text-base",
        dots: "h-9 min-w-9 px-2.5 text-base",
        iconSize: 18
    },
    xl: {
        list: "gap-2",
        item: "h-10 min-w-10 px-3.5 text-lg",
        dots: "h-10 min-w-10 px-3 text-lg",
        iconSize: 20
    }
};

const variants: Record<PaginationVariant, PaginationVariantStyles> = {
    default: {
        base: "border border-transparent",
        active:
            "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]",
        inactive:
            "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] hover:bg-[var(--refraktor-bg-hover)]"
    },
    filled: {
        base: "border border-transparent",
        active:
            "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]",
        inactive:
            "bg-[var(--refraktor-bg-subtle)] text-[var(--refraktor-text-secondary)] hover:bg-[var(--refraktor-bg-hover)] hover:text-[var(--refraktor-text)]"
    },
    outline: {
        base: "border border-[var(--refraktor-border)]",
        active:
            "border-[var(--refraktor-primary)] bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)]",
        inactive:
            "text-[var(--refraktor-text)] hover:border-[var(--refraktor-border-hover)] hover:bg-[var(--refraktor-bg-hover)]"
    },
    ghost: {
        base: "border border-transparent bg-transparent",
        active:
            "bg-[var(--refraktor-bg-hover)] text-[var(--refraktor-primary)]",
        inactive:
            "text-[var(--refraktor-text-secondary)] hover:bg-[var(--refraktor-bg-hover)] hover:text-[var(--refraktor-text)]"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

export const getVariant = (variant: PaginationVariant = "default") =>
    variants[variant];
