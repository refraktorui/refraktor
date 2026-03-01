import type { JSX } from "react";
import type { ShowProps, ShowRenderFunction } from "./show.types";

const Show = <T,>({ when, children, fallback = null }: ShowProps<T>): JSX.Element | null => {
    if (!when) {
        return fallback === null ? null : <>{fallback}</>;
    }

    if (typeof children === "function") {
        return <>{(children as ShowRenderFunction<T>)(when)}</>;
    }

    return <>{children}</>;
};

Show.displayName = "@refraktor/core/Show";

export default Show;
