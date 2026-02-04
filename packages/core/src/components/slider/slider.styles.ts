import { RefraktorSize } from "../../theme";

type SliderSizeStyles = {
    track: string;
    thumb: string;
    label: string;
};

const sizes: Record<RefraktorSize, SliderSizeStyles> = {
    xs: {
        track: "h-1",
        thumb: "w-3 h-3",
        label: "text-[8px] px-1 py-0.5"
    },
    sm: {
        track: "h-1.5",
        thumb: "w-3.5 h-3.5",
        label: "text-[10px] px-1.5 py-0.5"
    },
    md: {
        track: "h-2",
        thumb: "w-4 h-4",
        label: "text-xs px-2 py-1"
    },
    lg: {
        track: "h-2.5",
        thumb: "w-5 h-5",
        label: "text-sm px-2.5 py-1"
    },
    xl: {
        track: "h-3",
        thumb: "w-6 h-6",
        label: "text-base px-3 py-1.5"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
