import defaultColors from "../defaults/colors";

export function getShade(color: keyof typeof defaultColors, tone: number) {
    const value = defaultColors[color];

    if (Array.isArray(value)) {
        return value[tone];
    }

    return value;
}
