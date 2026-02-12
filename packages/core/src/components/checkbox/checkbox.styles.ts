import { RefraktorSize } from "../../theme";

type CheckboxSizeStyles = {
    indicator: string;
    icon: string;
    label: string;
    description: string;
    gap: string;
};

const sizes: Record<RefraktorSize, CheckboxSizeStyles> = {
    xs: {
        indicator: "h-3.5 w-3.5",
        icon: "h-2.5 w-2.5",
        label: "text-[10px]",
        description: "text-[10px]",
        gap: "gap-1.5"
    },
    sm: {
        indicator: "h-4 w-4",
        icon: "h-3 w-3",
        label: "text-xs",
        description: "text-xs",
        gap: "gap-2"
    },
    md: {
        indicator: "h-5 w-5",
        icon: "h-3.5 w-3.5",
        label: "text-sm",
        description: "text-xs",
        gap: "gap-2"
    },
    lg: {
        indicator: "h-6 w-6",
        icon: "h-4 w-4",
        label: "text-base",
        description: "text-sm",
        gap: "gap-2.5"
    },
    xl: {
        indicator: "h-7 w-7",
        icon: "h-4.5 w-4.5",
        label: "text-lg",
        description: "text-base",
        gap: "gap-3"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
