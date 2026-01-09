import { Ref, useCallback, RefCallback } from "react";

type AnyRef<T> = Ref<T> | undefined;
type CleanupFunction<T> = ReturnType<RefCallback<T>>;

function applyRef<T>(ref: AnyRef<T>, value: T | null): CleanupFunction<T> {
    if (!ref) return;

    if (typeof ref === "function") {
        return ref(value);
    }

    if (typeof ref === "object" && "current" in ref) {
        ref.current = value;
    }
}

export function mergeRefs<T>(...refs: AnyRef<T>[]): RefCallback<T> {
    const cleanups = new Map<AnyRef<T>, Exclude<CleanupFunction<T>, void>>();

    return (node: T | null) => {
        for (const ref of refs) {
            const cleanup = applyRef(ref, node);
            if (cleanup) cleanups.set(ref, cleanup);
        }

        if (cleanups.size > 0) {
            return () => {
                for (const ref of refs) {
                    const fn = cleanups.get(ref);
                    if (typeof fn === "function") {
                        fn();
                    } else {
                        applyRef(ref, null);
                    }
                }
                cleanups.clear();
            };
        }
    };
}

export function useMergedRefs<T>(...refs: AnyRef<T>[]) {
    return useCallback(mergeRefs(...refs), refs);
}
