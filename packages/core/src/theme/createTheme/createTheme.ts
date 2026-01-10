import defaultColors from "../defaults/colors";
import { defaultSettings } from "../defaults/settings";
import {
    ColorsConfig,
    ComponentsConfig,
    RefraktorTheme,
    ThemeDefaults,
    ThemeInput
} from "./types";

export const defaultTheme: RefraktorTheme = {
    defaults: defaultSettings,
    colors: defaultColors,
    components: {}
};

function mergeColors(
    base: ColorsConfig,
    override?: Partial<ColorsConfig>
): ColorsConfig {
    if (!override) return base;

    return { ...base, ...override } as ColorsConfig;
}

export function createTheme(settings: ThemeInput): RefraktorTheme {
    const defaults: Required<ThemeDefaults> = {
        radius: settings.defaults?.radius ?? defaultSettings.radius,
        padding: settings.defaults?.padding ?? defaultSettings.padding,
        primaryColor:
            settings.defaults?.primaryColor ?? defaultSettings.primaryColor,
        primaryShade:
            settings.defaults?.primaryShade ?? defaultSettings.primaryShade
    };

    const colors = mergeColors(defaultColors, settings.colors);
    const components: ComponentsConfig = settings?.components ?? {};

    return {
        defaults,
        colors,
        components
    };
}
