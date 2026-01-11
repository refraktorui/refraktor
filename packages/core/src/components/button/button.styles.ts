import { ButtonSize, ButtonVariant } from "./button.types";

const sizes: Record<ButtonSize, string> = {
    xs: "text-xs px-1.5 h-5 gap-1",
    sm: "text-xs px-2 h-6 gap-1.5",
    md: "text-sm px-2.5 h-8 gap-2",
    lg: "text-base px-3 h-10 gap-2.5",
    xl: "text-lg px-4 h-12 gap-3",
    "icon-xs": "size-5",
    "icon-sm": "size-6",
    "icon-md": "size-8",
    "icon-lg": "size-10",
    "icon-xl": "size-12"
};

export const getSize = (size: ButtonSize = "md") => sizes[size];

const variants: Record<ButtonVariant, string> = {
    default:
        "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] hover:bg-[var(--refraktor-bg-hover)]",
    filled: "bg-[var(--refraktor-primary)] text-[var(--refraktor-primary-text)] hover:bg-[var(--refraktor-primary-hover)]",
    outline:
        "text-[var(--refraktor-text)] border border-[var(--refraktor-border)] hover:border-[var(--refraktor-border-hover)]",
    ghost: "bg-transparent text-[var(--refraktor-text)] hover:bg-[var(--refraktor-bg-hover)]"
};

export const getVariant = (variant: ButtonVariant = "default") =>
    variants[variant];
