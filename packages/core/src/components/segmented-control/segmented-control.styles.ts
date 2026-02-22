import { RefraktorSize } from "../../theme";

type SegmentedControlSizeStyles = {
    root: string;
    control: string;
    label: string;
};

const sizes: Record<RefraktorSize, SegmentedControlSizeStyles> = {
    xs: {
        root: "p-0.5 gap-0.5",
        control: "h-4 px-2 min-w-6",
        label: "text-[8px]"
    },
    sm: {
        root: "p-0.5 gap-0.5",
        control: "h-5 px-2.5 min-w-7",
        label: "text-[10px]"
    },
    md: {
        root: "p-0.5 gap-0.5",
        control: "h-7 px-3 min-w-8",
        label: "text-xs"
    },
    lg: {
        root: "p-0.5 gap-0.5",
        control: "h-9 px-3.5 min-w-9",
        label: "text-sm"
    },
    xl: {
        root: "p-0.5 gap-0.5",
        control: "h-11 px-4 min-w-10",
        label: "text-base"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
