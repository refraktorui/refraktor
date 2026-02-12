import { RefraktorSize } from "../../theme";

const controlSizes = {
    xs: {
        width: "w-3",
        iconSize: 8,
        leftSpacing: "mr-0.5",
        rightSpacing: "ml-0.5"
    },
    sm: {
        width: "w-4",
        iconSize: 10,
        leftSpacing: "mr-0.5",
        rightSpacing: "ml-0.5"
    },
    md: {
        width: "w-5",
        iconSize: 12,
        leftSpacing: "mr-1",
        rightSpacing: "ml-1"
    },
    lg: {
        width: "w-6",
        iconSize: 14,
        leftSpacing: "mr-1",
        rightSpacing: "ml-1"
    },
    xl: {
        width: "w-7",
        iconSize: 16,
        leftSpacing: "mr-1.5",
        rightSpacing: "ml-1.5"
    }
};

export const getControlSize = (size: RefraktorSize = "md") =>
    controlSizes[size];
