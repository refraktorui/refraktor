import { RefraktorSize } from "../../../theme";
import { InputVariant } from "../../input";
import { TextareaResize } from "../textarea.types";

const sizes: Record<RefraktorSize, string> = {
    xs: "px-2 py-1 text-[8px]",
    sm: "px-2.5 py-1.5 text-[10px]",
    md: "px-3 py-2 text-xs",
    lg: "px-3.5 py-2.5 text-sm",
    xl: "px-4 py-3 text-base"
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

const resizes: Record<TextareaResize, string> = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize"
};

export const getResize = (resize: TextareaResize = "vertical") =>
    resizes[resize];
