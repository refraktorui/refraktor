import { RefraktorSize } from "../../theme";

const sizes: Record<RefraktorSize, string> = {
    xs: "size-6 text-xs",
    sm: "size-8 text-sm",
    md: "size-10 text-base",
    lg: "size-12 text-lg",
    xl: "size-16 text-xl"
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
