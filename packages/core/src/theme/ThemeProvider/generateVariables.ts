import { RefraktorTheme } from "../createTheme";
import { Theme } from "../types";
import { getShade } from "../utils";

const COLORS_TEMPLATE = "--refraktor-colors-{{color}}-{{index}}";
const SEMANTIC_TEMPLATE = "--refraktor-{{key}}";

type RGB = {
    r: number;
    g: number;
    b: number;
};

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

    return color;
}

function parseHexColor(color: string): RGB | null {
    const value = color.trim().replace(/^#/, "");

    if (![3, 4, 6, 8].includes(value.length)) return null;
    if (!/^[0-9a-fA-F]+$/.test(value)) return null;

    const normalized =
        value.length === 3 || value.length === 4
            ? value
                  .slice(0, 3)
                  .split("")
                  .map((char) => `${char}${char}`)
                  .join("")
            : value.slice(0, 6);

    return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16)
    };
}

function toRelativeLuminance(channel: number): number {
    const sRGB = channel / 255;

    if (sRGB <= 0.03928) return sRGB / 12.92;

    return ((sRGB + 0.055) / 1.055) ** 2.4;
}

function getLuminance(color: RGB): number {
    return (
        0.2126 * toRelativeLuminance(color.r) +
        0.7152 * toRelativeLuminance(color.g) +
        0.0722 * toRelativeLuminance(color.b)
    );
}

function getContrastRatio(background: RGB, foreground: RGB): number {
    const backgroundLuminance = getLuminance(background);
    const foregroundLuminance = getLuminance(foreground);

    const lighter = Math.max(backgroundLuminance, foregroundLuminance);
    const darker = Math.min(backgroundLuminance, foregroundLuminance);

    return (lighter + 0.05) / (darker + 0.05);
}

function getAutoContrastTextColor(
    themeConfig: RefraktorTheme,
    primaryBackground: string,
    fallbackColor: string
): string {
    const backgroundRGB = parseHexColor(primaryBackground);
    if (!backgroundRGB) return fallbackColor;

    const darkText = getShade(themeConfig.colors, "black", 0);
    const lightText = getShade(themeConfig.colors, "white", 0);

    const darkTextRGB = parseHexColor(darkText);
    const lightTextRGB = parseHexColor(lightText);

    if (!darkTextRGB || !lightTextRGB) return fallbackColor;

    return getContrastRatio(backgroundRGB, darkTextRGB) >=
        getContrastRatio(backgroundRGB, lightTextRGB)
        ? darkText
        : lightText;
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

    const { primaryColor, primaryShade, autoContrast } = defaults;

    const primaryColorValue = getColorShadeFromTheme(
        themeConfig,
        primaryColor,
        primaryShade
    );
    const primaryTextFallback = getColorShadeFromTheme(
        themeConfig,
        primaryColor,
        0
    );

    Object.entries(getSemanticColors(themeConfig)[theme]).forEach(
        ([key, value]) => {
            if (value !== undefined)
                variables[SEMANTIC_TEMPLATE.replace("{{key}}", key)] = value;
        }
    );

    Object.assign(variables, {
        "--refraktor-primary": primaryColorValue,
        "--refraktor-primary-hover": getColorShadeFromTheme(
            themeConfig,
            primaryColor,
            primaryShade - 1
        ),
        "--refraktor-primary-text": autoContrast
            ? getAutoContrastTextColor(
                  themeConfig,
                  primaryColorValue,
                  primaryTextFallback
              )
            : primaryTextFallback
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
