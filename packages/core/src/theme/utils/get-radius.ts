import type { ThemeDefaults } from "../createTheme";
import type { RefraktorRadius } from "../types";

const radiusMap: Record<RefraktorRadius, string> = {
    none: "rounded-[var(--refraktor-radius-none)]",
    default: "rounded-[var(--refraktor-radius-md)]",
    xs: "rounded-[var(--refraktor-radius-xs)]",
    sm: "rounded-[var(--refraktor-radius-sm)]",
    md: "rounded-[var(--refraktor-radius-md)]",
    lg: "rounded-[var(--refraktor-radius-lg)]",
    xl: "rounded-[var(--refraktor-radius-xl)]",
    "2xl": "rounded-[var(--refraktor-radius-2xl)]",
    "3xl": "rounded-[var(--refraktor-radius-3xl)]",
    "4xl": "rounded-[var(--refraktor-radius-4xl)]",
    full: "rounded-[var(--refraktor-radius-full)]"
};

export function getRadius(radius: RefraktorRadius, defaults?: ThemeDefaults) {
    const effectiveRadius =
        radius === "default" ? defaults?.radius ?? "md" : radius;

    return radiusMap[effectiveRadius] ?? radiusMap.default;
}
