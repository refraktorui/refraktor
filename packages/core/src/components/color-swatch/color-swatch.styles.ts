import { RefraktorSize } from "../../theme";

const sizes: Record<RefraktorSize, string> = {
    xs: "size-4",
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
    xl: "size-10"
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
