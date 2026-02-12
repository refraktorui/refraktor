import { useCallback, useEffect, useMemo, useRef } from "react";

export interface UseDebouncedCallbackOptions {
    leading?: boolean;
    trailing?: boolean;
}

export type UseDebouncedCallbackReturn<
    TArgs extends unknown[],
    TResult
> = ((...args: TArgs) => void) & {
    cancel: () => void;
    flush: () => TResult | undefined;
    isPending: () => boolean;
};

export function useDebouncedCallback<TArgs extends unknown[], TResult>(
    callback: (...args: TArgs) => TResult,
    delay: number,
    options: UseDebouncedCallbackOptions = {}
): UseDebouncedCallbackReturn<TArgs, TResult> {
    const { leading = false, trailing = true } = options;
    const wait = Math.max(0, delay);

    const callbackRef = useRef(callback);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastArgsRef = useRef<TArgs | null>(null);
    const shouldCallTrailingRef = useRef(false);
    const resultRef = useRef<TResult | undefined>(undefined);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const invoke = useCallback((args: TArgs) => {
        const result = callbackRef.current(...args);
        resultRef.current = result;
        return result;
    }, []);

    const clearTimer = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const cancel = useCallback(() => {
        clearTimer();
        shouldCallTrailingRef.current = false;
        lastArgsRef.current = null;
    }, [clearTimer]);

    const flush = useCallback(() => {
        if (timeoutRef.current === null) {
            return resultRef.current;
        }

        clearTimer();

        if (
            trailing &&
            shouldCallTrailingRef.current &&
            lastArgsRef.current !== null
        ) {
            const next = invoke(lastArgsRef.current);
            shouldCallTrailingRef.current = false;
            lastArgsRef.current = null;
            return next;
        }

        shouldCallTrailingRef.current = false;
        lastArgsRef.current = null;
        return resultRef.current;
    }, [clearTimer, invoke, trailing]);

    const isPending = useCallback(() => timeoutRef.current !== null, []);

    const debounced = useMemo(() => {
        const fn = (...args: TArgs) => {
            if (!leading && !trailing) {
                return;
            }

            const hasTimer = timeoutRef.current !== null;

            if (!hasTimer) {
                if (leading) {
                    invoke(args);
                    shouldCallTrailingRef.current = false;
                    lastArgsRef.current = null;
                } else {
                    shouldCallTrailingRef.current = true;
                    lastArgsRef.current = args;
                }
            } else if (trailing) {
                shouldCallTrailingRef.current = true;
                lastArgsRef.current = args;
            }

            clearTimer();
            timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null;

                if (
                    trailing &&
                    shouldCallTrailingRef.current &&
                    lastArgsRef.current !== null
                ) {
                    invoke(lastArgsRef.current);
                }

                shouldCallTrailingRef.current = false;
                lastArgsRef.current = null;
            }, wait);
        };

        return Object.assign(fn, {
            cancel,
            flush,
            isPending
        });
    }, [cancel, clearTimer, flush, invoke, isPending, leading, trailing, wait]);

    useEffect(() => cancel, [cancel]);

    return debounced;
}
