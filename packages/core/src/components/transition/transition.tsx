import { useId } from "@refraktor/utils";
import {
    createComponentConfig,
    polymorphicFactory,
    useProps
} from "../../utils";
import {
    TransitionFactoryPayload,
    TransitionProps,
    TransitionState
} from "./transition.types";
import { CSSProperties, useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import transitions from "./transitions";

const defaultProps = {
    duration: 200,
    delay: 0,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    transition: "fade",
    properties: ["opacity", "transform", "filter", "max-height"],
    onEnter: () => {},
    onEntered: () => {},
    onExit: () => {},
    onExited: () => {},
    useGPU: true,
    respectReducedMotion: true
} satisfies Partial<TransitionProps>;

const Transition = polymorphicFactory<TransitionFactoryPayload>(
    (_props, ref) => {
        const {
            as,
            id,
            mounted,
            children,
            duration,
            delay,
            easing,
            transition,
            styles,
            properties,
            unmountOnExit,
            onEnter,
            onEntered,
            onExit,
            onExited,
            useGPU,
            respectReducedMotion,
            className,
            ...props
        } = useProps("Transition", defaultProps, _props);

        const Component = as ?? "div";
        const _id = useId(id);

        const [state, setState] = useState<TransitionState>("exited");
        const [shouldRender, setShouldRender] = useState(
            mounted || !unmountOnExit
        );
        const timeoutRef = useRef<NodeJS.Timeout | null>(null);
        const nodeRef = useRef<HTMLElement>(null);
        const prefersReducedMotion = useRef(false);

        useEffect(() => {
            if (!respectReducedMotion) return;

            const mediaQuery = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );
            prefersReducedMotion.current = mediaQuery.matches;

            const handler = (e: MediaQueryListEvent) => {
                prefersReducedMotion.current = e.matches;
            };

            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        }, [respectReducedMotion]);

        const clearTimer = useCallback(() => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }, []);

        const performTransition = useCallback(
            (targetState: TransitionState, callback?: () => void) => {
                setState(targetState);
                callback?.();

                if (targetState === "entering" || targetState === "exiting") {
                    const finalState =
                        targetState === "entering" ? "entered" : "exited";
                    const finalCallback =
                        targetState === "entering" ? onEntered : onExited;

                    clearTimer();
                    timeoutRef.current = setTimeout(() => {
                        setState(finalState);
                        finalCallback?.();

                        if (finalState === "exited" && unmountOnExit) {
                            setShouldRender(false);
                        }
                    }, duration + delay);
                }
            },
            [duration, delay, onEntered, onExited, unmountOnExit, clearTimer]
        );

        useEffect(() => {
            if (mounted) {
                setShouldRender(true);
                requestAnimationFrame(() => {
                    performTransition("entering", onEnter);
                });
            } else {
                performTransition("exiting", onExit);
            }

            return clearTimer;
        }, [mounted, performTransition, onEnter, onExit, clearTimer]);

        if (!shouldRender) {
            return null;
        }

        const transitionStyles = styles ?? transitions[transition];
        const currentStyle = transitionStyles[state] ?? {};

        const effectiveDuration = prefersReducedMotion.current ? 0 : duration;
        const effectiveDelay = prefersReducedMotion.current ? 0 : delay;

        const transitionCSS = properties
            .map(
                (prop) =>
                    `${prop} ${effectiveDuration}ms ${easing} ${effectiveDelay}ms`
            )
            .join(", ");

        const combinedStyle: CSSProperties = {
            transition: transitionCSS,
            ...(useGPU && { willChange: properties.join(", ") }),
            ...currentStyle
        };

        const content =
            typeof children === "function" ? children(state) : children;

        return (
            <Component
                ref={nodeRef as any}
                className={className}
                style={combinedStyle}
                data-transition-state={state}
            >
                {content}
            </Component>
        );
    }
);

Transition.displayName = "@refraktor/core/Transition";
Transition.configure = createComponentConfig<TransitionProps>();

export default Transition;
