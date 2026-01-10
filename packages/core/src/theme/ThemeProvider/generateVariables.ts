import { RefraktorTheme } from "../createTheme";
import { Theme } from "../types";
import { getShade } from "../utils";

const COLORS_TEMPLATE = "--refraktor-colors-{{color}}-{{index}}";
const SEMANTIC_TEMPLATE = "--refraktor-{{key}}";

export type ThemeVariables = {
    [key: string]: string;
};

function getColorShadeFromTheme(
    themeConfig: RefraktorTheme,
    color: string,
    shade: number
): string {
    const colorValue = themeConfig.colors[color];

    if (typeof colorValue === "string") return colorValue;

    if (Array.isArray(colorValue))
        return colorValue[Math.min(Math.max(0, shade), 9)] ?? colorValue[5];

    return "#000000";
}

const SEMANTIC_COLORS = {
    light: {
        bg: getShade("light", 2),
        "bg-hover": getShade("light", 3),
        "bg-subtle": getShade("light", 1),
        "bg-elevated": getShade("light", 0),

        text: getShade("black", 0),
        "text-secondary": getShade("dark", 6),
        "text-tertiary": getShade("dark", 7),

        border: getShade("light", 4),
        "border-hover": getShade("light", 5)
    },
    dark: {
        bg: getShade("dark", 6),
        "bg-hover": getShade("dark", 5),
        "bg-subtle": getShade("dark", 7),
        "bg-elevated": getShade("dark", 5),

        text: getShade("white", 0),
        "text-secondary": getShade("light", 3),
        "text-tertiary": getShade("light", 4),

        border: getShade("dark", 4),
        "border-hover": getShade("dark", 3)
    }
};

export const generateVariables = (
    theme: Theme,
    themeConfig: RefraktorTheme
): ThemeVariables => {
    const variables: ThemeVariables = {};
    const { colors, defaults } = themeConfig;

    const { primaryColor, primaryShade } = defaults;

    Object.entries(SEMANTIC_COLORS[theme]).forEach(([key, value]) => {
        if (value !== undefined)
            variables[SEMANTIC_TEMPLATE.replace("{{key}}", key)] = value;
    });

    Object.assign(variables, {
        "--refraktor-primary": getColorShadeFromTheme(
            themeConfig,
            primaryColor,
            primaryShade
        )
    });

    Object.entries(colors).forEach(([color, shade]) => {
        if (!Array.isArray(shade)) return;

        shade.forEach((shade, index) => {
            const varName = COLORS_TEMPLATE.replace("{{color}}", color).replace(
                "{{index}}",
                index.toString()
            );
            variables[varName] = shade;
        });
    });

    return variables;
};
