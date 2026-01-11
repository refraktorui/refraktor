import { ColorsConfig } from "../createTheme/types";
import defaultColors from "../defaults/colors";

export function getShade(
    colors: ColorsConfig,
    color: keyof typeof defaultColors,
    tone: number
) {
    const value = colors[color] ?? defaultColors[color];

    if (Array.isArray(value)) {
        return value[Math.min(Math.max(0, tone), 9)] ?? value[5];
    }

    return value;
}
