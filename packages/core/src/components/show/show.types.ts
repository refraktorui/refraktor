import { ReactNode } from "react";

export type ShowRenderFunction<T> = (value: T) => ReactNode;

export type ShowProps<T> = {
    /** Value checked with Boolean(when). */
    when?: T | null;

    /** Content rendered when when is truthy. */
    children: ReactNode | ShowRenderFunction<T>;

    /** Node rendered when when is falsy. */
    fallback?: ReactNode;
};
