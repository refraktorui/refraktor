import { RefraktorSize } from "../../theme";

type ProgressSizeStyles = {
    track: string;
};

const sizes: Record<RefraktorSize, ProgressSizeStyles> = {
    xs: {
        track: "h-1"
    },
    sm: {
        track: "h-1.5"
    },
    md: {
        track: "h-2"
    },
    lg: {
        track: "h-2.5"
    },
    xl: {
        track: "h-3"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
