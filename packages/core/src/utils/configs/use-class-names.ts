import { useMemo } from "react";
import { ClassNamesRecord, useThemeContext } from "../../theme";
import { cx } from "../cx";

function mergeClassNames<T extends ClassNamesRecord>(
    themeClassNames: Partial<T> | undefined,
    runtimeClassNames: Partial<T> | undefined
): T {
    const allKeys = new Set([
        ...Object.keys(themeClassNames ?? {}),
        ...Object.keys(runtimeClassNames ?? {})
    ]);

    const result: ClassNamesRecord = {};

    for (const key of Array.from(allKeys)) {
        const combined = cx(themeClassNames?.[key], runtimeClassNames?.[key]);

        if (combined) {
            result[key] = combined;
        }
    }

    return result as T;
}

export function useClassNames<T extends ClassNamesRecord>(
    componentName: string,
    runtimeClassNames: Partial<T> | undefined
): T {
    const { components } = useThemeContext();

    const themeClassNames = components?.[componentName]?.classNames as
        | Partial<T>
        | undefined;

    return useMemo(
        () => mergeClassNames<T>(themeClassNames, runtimeClassNames),
        [themeClassNames, runtimeClassNames]
    );
}
