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

const getSemanticColors = (themeConfig: RefraktorTheme) => ({
    light: {
        bg: getShade(themeConfig.colors, "light", 2),
        "bg-hover": getShade(themeConfig.colors, "light", 3),
        "bg-subtle": getShade(themeConfig.colors, "light", 1),
        "bg-elevated": getShade(themeConfig.colors, "light", 0),

        text: getShade(themeConfig.colors, "black", 0),
        "text-secondary": getShade(themeConfig.colors, "dark", 6),
        "text-tertiary": getShade(themeConfig.colors, "dark", 7),

        border: getShade(themeConfig.colors, "light", 4),
        "border-hover": getShade(themeConfig.colors, "light", 5),

        "scroll-track": "transparent",
        "scroll-thumb": getShade(themeConfig.colors, "light", 4),
        "scroll-thumb-hover": getShade(themeConfig.colors, "light", 5)
    },
    dark: {
        bg: getShade(themeConfig.colors, "dark", 6),
        "bg-hover": getShade(themeConfig.colors, "dark", 5),
        "bg-subtle": getShade(themeConfig.colors, "dark", 7),
        "bg-elevated": getShade(themeConfig.colors, "dark", 5),

        text: getShade(themeConfig.colors, "white", 0),
        "text-secondary": getShade(themeConfig.colors, "dark", 1),
        "text-tertiary": getShade(themeConfig.colors, "dark", 2),

        border: getShade(themeConfig.colors, "dark", 4),
        "border-hover": getShade(themeConfig.colors, "dark", 3),

        "scroll-track": "transparent",
        "scroll-thumb": getShade(themeConfig.colors, "dark", 4),
        "scroll-thumb-hover": getShade(themeConfig.colors, "dark", 3)
    }
});

export const generateVariables = (
    theme: Theme,
    themeConfig: RefraktorTheme
): ThemeVariables => {
    const variables: ThemeVariables = {};
    const { colors, defaults } = themeConfig;

    const { primaryColor, primaryShade } = defaults;

    Object.entries(getSemanticColors(themeConfig)[theme]).forEach(
        ([key, value]) => {
            if (value !== undefined)
                variables[SEMANTIC_TEMPLATE.replace("{{key}}", key)] = value;
        }
    );

    Object.assign(variables, {
        "--refraktor-primary": getColorShadeFromTheme(
            themeConfig,
            primaryColor,
            primaryShade
        ),
        "--refraktor-primary-hover": getColorShadeFromTheme(
            themeConfig,
            primaryColor,
            primaryShade - 1
        ),
        "--refraktor-primary-text": getColorShadeFromTheme(
            themeConfig,
            primaryColor,
            0
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
