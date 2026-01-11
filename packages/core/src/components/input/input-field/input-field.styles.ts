import { RefraktorSize } from "../../../theme";
import { InputVariant } from "../input.types";

const sizes: Record<RefraktorSize, string> = {
    xs: "h-5 px-2 text-[8px]",
    sm: "h-6 px-2.5 text-[10px]",
    md: "h-8 px-3 text-xs",
    lg: "h-10 px-3.5 text-sm",
    xl: "h-12 px-4 text-base"
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

const variants: Record<InputVariant, string> = {
    default:
        "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] border border-[var(--refraktor-border)]",
    filled: "bg-[var(--refraktor-bg)] text-[var(--refraktor-text)]",
    outline:
        "bg-transparent text-[var(--refraktor-text)] border border-[var(--refraktor-border)]"
};

export const getVariant = (variant: InputVariant = "default") =>
    variants[variant];
