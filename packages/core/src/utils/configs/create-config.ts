import { ClassNamesRecord } from "../../theme/createTheme";

export function createComponentConfig<Props extends Record<string, any>>() {
    return function configure(defaultProps: Partial<Props>): Partial<Props> {
        return defaultProps;
    };
}

export function createClassNamesConfig<ClassNames extends ClassNamesRecord>() {
    return function classNames(
        classNamesConfig: Partial<ClassNames>
    ): Partial<ClassNames> {
        return classNamesConfig;
    };
}
