import { RefraktorSize } from "../../theme";

type SegmentedControlSizeStyles = {
    root: string;
    control: string;
    label: string;
};

const sizes: Record<RefraktorSize, SegmentedControlSizeStyles> = {
    xs: {
        root: "p-0.5 gap-0.5",
        control: "h-6 px-2 min-w-7",
        label: "text-[10px]"
    },
    sm: {
        root: "p-0.5 gap-0.5",
        control: "h-7 px-2.5 min-w-8",
        label: "text-xs"
    },
    md: {
        root: "p-1 gap-1",
        control: "h-8 px-3 min-w-9",
        label: "text-sm"
    },
    lg: {
        root: "p-1 gap-1",
        control: "h-9 px-3.5 min-w-10",
        label: "text-base"
    },
    xl: {
        root: "p-1.5 gap-1.5",
        control: "h-10 px-4 min-w-11",
        label: "text-lg"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
