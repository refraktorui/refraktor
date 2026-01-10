import { useThemeContext } from "../../theme";

type PropsWithSpecialKeys = {
    ref?: unknown;
    [key: string]: unknown;
};

function filterSpecialProps<T extends PropsWithSpecialKeys>(
    props: T
): Omit<T, "ref"> {
    const { ref: _, ...rest } = props;
    return rest as Omit<T, "ref">;
}

export function useProps<
    Props extends Record<string, any>,
    Defaults extends Partial<Props> = {}
>(
    componentName: string,
    localDefaults: Defaults | null,
    runtimeProps: Props
): Omit<Props, "ref"> & {
    [K in keyof Defaults & keyof Props]-?: Defaults[K] | NonNullable<Props[K]>;
} {
    const { components } = useThemeContext();

    const themeDefaults =
        (components?.[componentName]?.defaultProps as Partial<Props>) ?? {};

    const safeLocalDefaults = (localDefaults ?? {}) as Defaults;

    const filteredLocalDefaults = filterSpecialProps(
        safeLocalDefaults as PropsWithSpecialKeys
    );
    const filteredThemeDefaults = filterSpecialProps(
        themeDefaults as PropsWithSpecialKeys
    );
    const filteredRuntimeProps = filterSpecialProps(
        runtimeProps as PropsWithSpecialKeys
    );

    const runtimePropsWithoutUndefined = Object.fromEntries(
        Object.entries(filteredRuntimeProps).filter(
            ([_, value]) => value !== undefined
        )
    ) as typeof filteredRuntimeProps;

    const merged = {
        ...filteredLocalDefaults,
        ...filteredThemeDefaults,
        ...runtimePropsWithoutUndefined
    };

    return merged as any;
}
