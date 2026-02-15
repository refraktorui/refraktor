import { RefraktorSize } from "../../theme";
import { AccordionVariant } from "./accordion.types";

type AccordionSizeStyles = {
    control: string;
    panel: string;
    chevron: string;
};

type AccordionVariantStyles = {
    item: string;
    control: string;
    panel: string;
};

const sizes: Record<RefraktorSize, AccordionSizeStyles> = {
    xs: {
        control: "min-h-7 px-2 py-1 text-xs",
        panel: "px-2 pb-2 text-xs",
        chevron: "size-3"
    },
    sm: {
        control: "min-h-8 px-2.5 py-1.5 text-sm",
        panel: "px-2.5 pb-2.5 text-sm",
        chevron: "size-3.5"
    },
    md: {
        control: "min-h-9 px-3 py-2 text-sm",
        panel: "px-3 pb-3 text-sm",
        chevron: "size-4"
    },
    lg: {
        control: "min-h-10 px-3.5 py-2.5 text-base",
        panel: "px-3.5 pb-3.5 text-base",
        chevron: "size-4.5"
    },
    xl: {
        control: "min-h-11 px-4 py-3 text-lg",
        panel: "px-4 pb-4 text-lg",
        chevron: "size-5"
    }
};

const variants: Record<AccordionVariant, AccordionVariantStyles> = {
    default: {
        item: "border-b border-[var(--refraktor-border)] last:border-b-0",
        control: "bg-transparent hover:bg-[var(--refraktor-bg-hover)]",
        panel: "text-[var(--refraktor-text-secondary)]"
    },
    separated: {
        item: "border border-[var(--refraktor-border)] bg-[var(--refraktor-bg-subtle)]",
        control: "bg-transparent hover:bg-[var(--refraktor-bg-hover)]",
        panel: "border-t border-[var(--refraktor-border)] text-[var(--refraktor-text-secondary)]"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

export const getVariant = (variant: AccordionVariant = "default") =>
    variants[variant];
