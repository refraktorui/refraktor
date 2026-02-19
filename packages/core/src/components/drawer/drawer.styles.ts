import { CSSProperties } from "react";
import { RefraktorSize } from "../../theme";
import { DrawerPosition } from "./drawer.types";

const sizes: Record<RefraktorSize, string> = {
    xs: "16rem",
    sm: "20rem",
    md: "24rem",
    lg: "30rem",
    xl: "36rem"
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

export function getSizeStyles(
    position: DrawerPosition,
    size: RefraktorSize = "md"
): CSSProperties {
    const resolvedSize = getSize(size);

    if (position === "left" || position === "right") {
        return {
            width: resolvedSize,
            maxWidth: "100vw"
        };
    }

    return {
        height: resolvedSize,
        maxHeight: "100vh"
    };
}
