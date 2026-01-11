import {
    ColorShade,
    PrimaryColor,
    RefraktorRadius,
    RefraktorSize
} from "../types";

export type ColorScale = readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
];
export type ColorsConfig = {
    [key: string]: ColorScale | string;
};

export type ThemeDefaults = {
    /** Default border radius @default `md` */
    radius?: RefraktorRadius;

    /** Default padding @default `md` */
    padding?: RefraktorSize;

    /** Primary color. Can be a hex code or a color from the default colors @default `teal` */
    primaryColor?: PrimaryColor | string;

    /** Primary color shade @default `5` */
    primaryShade?: ColorShade;
};

export type RefraktorTheme = {
    defaults: Required<ThemeDefaults>;
    colors: Required<ColorsConfig>;
};

export type ThemeInput = {
    /** Colors for the theme */
    colors?: ColorsConfig;

    /** Default settings for the theme */
    defaults?: ThemeDefaults;
};


export type ClassNamesRecord = Record<string, string | undefined>;

export type ComponentConfigObject<
    Props = Record<string, any>,
    ClassNames extends ClassNamesRecord = ClassNamesRecord
> = {
    /** Default props for the component */
    defaultProps?: Partial<Props>;

    /* Default class names for the component */
    classNames?: ClassNames;
};

export type ComponentsConfig = {
    [componentName: string]: ComponentConfigObject<any, any>;
};
