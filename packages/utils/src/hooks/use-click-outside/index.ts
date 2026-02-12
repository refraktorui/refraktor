import { useEffect, useRef } from "react";

export type UseClickOutsideEvent = keyof DocumentEventMap;

type UseClickOutsideNode = HTMLElement | null;

const DEFAULT_EVENTS: UseClickOutsideEvent[] = ["mousedown", "touchstart"];
const DEFAULT_NODES: UseClickOutsideNode[] = [];

export function useClickOutside<T extends HTMLElement = HTMLElement>(
    handler: (event: Event) => void,
    events: UseClickOutsideEvent[] = DEFAULT_EVENTS,
    nodes: UseClickOutsideNode[] = DEFAULT_NODES
) {
    const ref = useRef<T>(null);
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (event: Event) => {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            const element = ref.current;

            if (!element) {
                return;
            }

            const path =
                typeof event.composedPath === "function"
                    ? event.composedPath()
                    : undefined;

            const isInsideElement = path
                ? path.includes(element)
                : element.contains(target);

            if (isInsideElement) {
                return;
            }

            const isInsideAdditionalNode = nodes.some((node) => {
                if (!node) {
                    return false;
                }

                return path ? path.includes(node) : node.contains(target);
            });

            if (isInsideAdditionalNode) {
                return;
            }

            handlerRef.current(event);
        };

        for (const eventName of events) {
            document.addEventListener(eventName, listener);
        }

        return () => {
            for (const eventName of events) {
                document.removeEventListener(eventName, listener);
            }
        };
    }, [events, nodes]);

    return ref;
}
