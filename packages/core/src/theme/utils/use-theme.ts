import { useThemeContext } from "../ThemeProvider";
import { RefraktorPadding, RefraktorRadius } from "../types";
import { getPadding } from "./get-padding";
import { getRadius } from "./get-radius";

export function useTheme() {
    const { theme, setTheme, toggleTheme, themeConfig } = useThemeContext();

    if (!theme)
        throw new Error(
            "[@refraktor/core] ThemeProvider was not found in the tree"
        );

    const _getRadius = (radius: RefraktorRadius = "default") =>
        getRadius(radius, themeConfig.defaults);

    const _getPadding = (padding?: RefraktorPadding) =>
        getPadding(padding, themeConfig.defaults);


    return {
        theme,
        setTheme,
        toggleTheme,
        getRadius: _getRadius,
        getPadding: _getPadding,

        colors: themeConfig.colors
    };
}
