import { ThemeDefaults } from "../createTheme";
import { RefraktorPadding } from "../types";

const paddingMap: Record<RefraktorPadding, string> = {
    none: "p-0",
    xs: "p-1",
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
    xl: "p-5"
};

export function getPadding(
    padding?: RefraktorPadding,
    defaults?: ThemeDefaults
) {
    const effectivePadding = padding ?? defaults?.padding ?? "md";

    if (effectivePadding === "none") return paddingMap.none;

    return paddingMap[effectivePadding] ?? paddingMap.md;
}

