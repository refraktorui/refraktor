import { RefraktorSize } from "../../theme";

type RadioSizeStyles = {
    indicator: string;
    dot: string;
    label: string;
    description: string;
    gap: string;
};

const sizes: Record<RefraktorSize, RadioSizeStyles> = {
    xs: {
        indicator: "h-3.5 w-3.5",
        dot: "h-1.5 w-1.5",
        label: "text-[10px]",
        description: "text-[10px]",
        gap: "gap-1.5"
    },
    sm: {
        indicator: "h-4 w-4",
        dot: "h-2 w-2",
        label: "text-xs",
        description: "text-xs",
        gap: "gap-2"
    },
    md: {
        indicator: "h-5 w-5",
        dot: "h-2.5 w-2.5",
        label: "text-sm",
        description: "text-xs",
        gap: "gap-2"
    },
    lg: {
        indicator: "h-6 w-6",
        dot: "h-3 w-3",
        label: "text-base",
        description: "text-sm",
        gap: "gap-2.5"
    },
    xl: {
        indicator: "h-7 w-7",
        dot: "h-3.5 w-3.5",
        label: "text-lg",
        description: "text-base",
        gap: "gap-3"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
