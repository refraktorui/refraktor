import { useCallback, useEffect, useRef, useState } from "react";

export interface UseResizeObserverSize {
    width: number;
    height: number;
}

export interface UseResizeObserverOptions {
    initialSize?: UseResizeObserverSize;
    box?: ResizeObserverBoxOptions;
    onResize?: (entry: ResizeObserverEntry) => void;
}

export interface UseResizeObserverReturn<T extends HTMLElement = HTMLElement>
    extends UseResizeObserverSize {
    ref: (node: T | null) => void;
    entry: ResizeObserverEntry | null;
}

interface ResizeObserverState extends UseResizeObserverSize {
    entry: ResizeObserverEntry | null;
}

const DEFAULT_SIZE: UseResizeObserverSize = {
    width: 0,
    height: 0
};

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
    options: UseResizeObserverOptions = {}
): UseResizeObserverReturn<T> {
    const { initialSize = DEFAULT_SIZE, box, onResize } = options;
    const [node, setNode] = useState<T | null>(null);
    const [state, setState] = useState<ResizeObserverState>(() => ({
        width: initialSize.width,
        height: initialSize.height,
        entry: null
    }));
    const onResizeRef = useRef(onResize);

    useEffect(() => {
        onResizeRef.current = onResize;
    }, [onResize]);

    const ref = useCallback((nextNode: T | null) => {
        setNode(nextNode);
    }, []);

    useEffect(() => {
        if (!node) {
            return;
        }

        if (
            typeof window === "undefined" ||
            typeof ResizeObserver === "undefined"
        ) {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            if (!entry) {
                return;
            }

            const nextWidth = entry.contentRect.width;
            const nextHeight = entry.contentRect.height;

            setState((current) => {
                if (
                    current.width === nextWidth &&
                    current.height === nextHeight &&
                    current.entry !== null
                ) {
                    return current;
                }

                return {
                    width: nextWidth,
                    height: nextHeight,
                    entry
                };
            });

            onResizeRef.current?.(entry);
        });

        try {
            observer.observe(node, box ? { box } : undefined);
        } catch {
            observer.observe(node);
        }

        return () => {
            observer.disconnect();
        };
    }, [box, node]);

    return {
        ref,
        width: state.width,
        height: state.height,
        entry: state.entry
    };
}
