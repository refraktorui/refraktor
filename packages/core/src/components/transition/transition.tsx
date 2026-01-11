import { useId } from "@refraktor/utils";
import {
    createComponentConfig,
    polymorphicFactory,
    useProps
} from "../../utils";
import {
    TransitionFactoryPayload,
    TransitionProps,
    Transitions,
    TransitionState,
    TransitionStyles
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
    unmountOnExit: true,
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

        useEffect(() => {
            if (mounted) {
                setShouldRender(true);
                requestAnimationFrame(() => {
                    setState("entering");
                    onEnter?.();
                    requestAnimationFrame(() => {
                        setState("entered");
                        clearTimer();
                        timeoutRef.current = setTimeout(() => {
                            onEntered?.();
                        }, duration + delay);
                    });
                });
            } else {
                setState("exiting");
                onExit?.();
                clearTimer();
                timeoutRef.current = setTimeout(() => {
                    setState("exited");
                    onExited?.();
                    if (unmountOnExit) {
                        setShouldRender(false);
                    }
                }, duration + delay);
            }

            return clearTimer;
        }, [
            mounted,
            duration,
            delay,
            onEnter,
            onEntered,
            onExit,
            onExited,
            unmountOnExit,
            clearTimer
        ]);

        if (!shouldRender) {
            return null;
        }

        let transitionStyles: TransitionStyles;
        let detectedProperties: string[] | undefined;

        if (typeof transition === "string") {
            transitionStyles = transitions[transition as Transitions];
        } else {
            transitionStyles = transition;
            detectedProperties = (transition as any).__properties;
        }

        const currentStyle = transitionStyles[state] ?? {};

        const effectiveDuration = prefersReducedMotion.current ? 0 : duration;
        const effectiveDelay = prefersReducedMotion.current ? 0 : delay;

        const effectiveProperties = detectedProperties ?? properties;

        const transitionCSS = effectiveProperties
            .map(
                (prop) =>
                    `${prop} ${effectiveDuration}ms ${easing} ${effectiveDelay}ms`
            )
            .join(", ");

        const combinedStyle: CSSProperties = {
            transition: transitionCSS,
            ...(useGPU && { willChange: effectiveProperties.join(", ") }),
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
