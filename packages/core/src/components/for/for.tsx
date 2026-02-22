import { Fragment } from "react";
import type { JSX } from "react";
import type { ForProps } from "./for.types";

const normalize = <T,>(collection?: ForProps<T>["each"]): T[] => {
    if (!collection) {
        return [];
    }

    if (Array.isArray(collection)) {
        return collection.slice();
    }

    return Array.from(collection as Iterable<T> | ArrayLike<T>);
};

const For = <T,>({
    each,
    children,
    fallback = null,
    keyExtractor
}: ForProps<T>): JSX.Element | null => {
    const items = normalize(each);

    if (items.length === 0) {
        return fallback === null ? null : <>{fallback}</>;
    }

    const lastIndex = items.length - 1;

    return (
        <>
            {items.map((item, index) => {
                const meta = {
                    index,
                    length: items.length,
                    isFirst: index === 0,
                    isLast: index === lastIndex,
                    previous: index > 0 ? items[index - 1] : undefined,
                    next: index < lastIndex ? items[index + 1] : undefined
                };

                const key = keyExtractor?.(item, index) ?? index;

                return <Fragment key={key}>{children(item, meta)}</Fragment>;
            })}
        </>
    );
};

For.displayName = "@refraktor/core/For";

export default For;
