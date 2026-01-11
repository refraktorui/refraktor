import { useThemeContext } from "../ThemeProvider";
import { RefraktorRadius } from "../types";
import { getRadius } from "./get-radius";
import { cx } from "../../utils";

export function useTheme() {
    const { theme, setTheme, toggleTheme, themeConfig } = useThemeContext();

    if (!theme)
        throw new Error(
            "[@refraktor/core] ThemeProvider was not found in the tree"
        );

    const _getRadius = (radius: RefraktorRadius = "default") =>
        getRadius(radius, themeConfig.defaults);

    return {
        theme,
        setTheme,
        toggleTheme,
        getRadius: _getRadius,

        colors: themeConfig.colors,

        cx
    };
}
