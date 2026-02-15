import { RefraktorSize } from "../../theme";

type ProgressCircleSizeStyles = {
    size: number;
    stroke: number;
};

const sizes: Record<RefraktorSize, ProgressCircleSizeStyles> = {
    xs: {
        size: 16,
        stroke: 2
    },
    sm: {
        size: 20,
        stroke: 2.5
    },
    md: {
        size: 24,
        stroke: 3
    },
    lg: {
        size: 32,
        stroke: 4
    },
    xl: {
        size: 40,
        stroke: 5
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
