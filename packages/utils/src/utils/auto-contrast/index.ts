type RGB = {
    r: number;
    g: number;
    b: number;
};

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

export function getAutoContrastTextColor(
    background: string,
    darkText: string,
    lightText: string,
    fallbackColor: string
): string {
    const backgroundRGB = parseHexColor(background);
    if (!backgroundRGB) return fallbackColor;

    const darkTextRGB = parseHexColor(darkText);
    const lightTextRGB = parseHexColor(lightText);

    if (!darkTextRGB || !lightTextRGB) return fallbackColor;

    return getContrastRatio(backgroundRGB, darkTextRGB) >=
        getContrastRatio(backgroundRGB, lightTextRGB)
        ? darkText
        : lightText;
}
