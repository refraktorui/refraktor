import { useId } from "@refraktor/utils";
import {
    createComponentConfig,
    polymorphicFactory,
    useProps
} from "../../utils";
import {
    TransitionDefinition,
    TransitionDirection,
    TransitionFactoryPayload,
    TransitionProps,
    TransitionState,
    TransitionTimingValue
} from "./transition.types";
import {
    CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import transitions from "./transitions";

const defaultProps = {
    duration: 200,
    delay: 0,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    transition: "fade",
    properties: "auto",
    keepMounted: false,
    appear: true,
    immediate: false,
    useGPU: true,
    reduceMotion: "respect",
    onEnterStart: () => {},
    onEnterEnd: () => {},
    onExitStart: () => {},
    onExitEnd: () => {},
    onStateChange: () => {}
} satisfies Partial<TransitionProps>;

const resolveTimingValue = <T,>(
    value: TransitionTimingValue<T> | undefined,
    direction: TransitionDirection,
    fallback: T
): T => {
    if (value == null) {
        return fallback;
    }

    if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null &&
        ("enter" in value || "exit" in value)
    ) {
        return (
            (value as Partial<Record<TransitionDirection, T>>)[direction] ??
            fallback
        );
    }

    return value as T;
};

const prefersReducedMotionQuery = "(prefers-reduced-motion: reduce)";

const resolveTransitionDefinition = (
    transition: TransitionProps["transition"]
): TransitionDefinition => {
    if (!transition || typeof transition === "string") {
        return transitions[(transition ?? "fade") as keyof typeof transitions];
    }

    return transition;
};

const collectTransitionProperties = (
    transitionDefinition: TransitionDefinition
): string[] => {
    if (transitionDefinition.properties?.length) {
        return transitionDefinition.properties;
    }

    return ["opacity", "transform"];
};

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
            keepMounted,
            appear,
            immediate,
            reduceMotion,
            onEnterStart,
            onEnterEnd,
            onExitStart,
            onExitEnd,
            onStateChange,
            useGPU,
            className,
            style,
            ...props
        } = useProps("Transition", defaultProps, _props);

        const Component = as ?? "div";
        const _id = useId(id);

        const [state, setState] = useState<TransitionState>(() => {
            if (mounted && !appear) {
                return "entered";
            }

            return mounted ? "entering" : "exited";
        });
        const [isRendered, setIsRendered] = useState(mounted || keepMounted);
        const [direction, setDirection] = useState<TransitionDirection>(
            mounted ? "enter" : "exit"
        );
        const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
            if (
                typeof window === "undefined" ||
                typeof window.matchMedia !== "function"
            ) {
                return false;
            }

            return window.matchMedia(prefersReducedMotionQuery).matches;
        });

        const isInitialRender = useRef(true);
        const timeoutRef = useRef<number | null>(null);
        const rafRef = useRef<number | null>(null);
        const runIdRef = useRef(0);

        const clearScheduled = useCallback(() => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        }, []);

        const setTransitionState = useCallback(
            (nextState: TransitionState) => {
                setState((previousState) => {
                    if (previousState !== nextState) {
                        onStateChange?.(nextState);
                    }

                    return nextState;
                });
            },
            [onStateChange]
        );

        useEffect(() => {
            if (
                reduceMotion !== "respect" ||
                typeof window.matchMedia !== "function"
            ) {
                return;
            }

            const mediaQuery = window.matchMedia(prefersReducedMotionQuery);
            setPrefersReducedMotion(mediaQuery.matches);

            const handleChange = (event: MediaQueryListEvent) => {
                setPrefersReducedMotion(event.matches);
            };

            mediaQuery.addEventListener("change", handleChange);

            return () => {
                mediaQuery.removeEventListener("change", handleChange);
            };
        }, [reduceMotion]);

        const shouldReduceMotion =
            immediate ||
            reduceMotion === "always" ||
            (reduceMotion === "respect" && prefersReducedMotion);

        const enterDuration = resolveTimingValue(duration, "enter", 200);
        const exitDuration = resolveTimingValue(duration, "exit", 200);
        const enterDelay = resolveTimingValue(delay, "enter", 0);
        const exitDelay = resolveTimingValue(delay, "exit", 0);

        const enterEasing = resolveTimingValue(
            easing,
            "enter",
            "cubic-bezier(0.4, 0, 0.2, 1)"
        );
        const exitEasing = resolveTimingValue(
            easing,
            "exit",
            "cubic-bezier(0.4, 0, 0.2, 1)"
        );

        useEffect(() => {
            runIdRef.current += 1;
            const runId = runIdRef.current;
            const isFirstRun = isInitialRender.current;
            isInitialRender.current = false;

            clearScheduled();

            if (mounted) {
                setDirection("enter");
                setIsRendered(true);

                if (isFirstRun && !appear) {
                    setTransitionState("entered");
                    return;
                }

                onEnterStart?.();

                if (shouldReduceMotion) {
                    setTransitionState("entered");
                    onEnterEnd?.();
                    return;
                }

                setTransitionState("entering");

                rafRef.current = window.requestAnimationFrame(() => {
                    if (runIdRef.current !== runId) {
                        return;
                    }

                    setTransitionState("entered");

                    const waitTime = enterDuration + enterDelay;

                    if (waitTime <= 0) {
                        onEnterEnd?.();
                        return;
                    }

                    timeoutRef.current = window.setTimeout(() => {
                        if (runIdRef.current !== runId) {
                            return;
                        }

                        onEnterEnd?.();
                    }, waitTime);
                });

                return;
            }

            if (isFirstRun) {
                setTransitionState("exited");
                setIsRendered(keepMounted);
                return;
            }

            setDirection("exit");

            if (!isRendered && !keepMounted) {
                return;
            }

            onExitStart?.();

            if (shouldReduceMotion) {
                setTransitionState("exited");
                onExitEnd?.();

                if (!keepMounted) {
                    setIsRendered(false);
                }

                return;
            }

            setTransitionState("exiting");

            rafRef.current = window.requestAnimationFrame(() => {
                if (runIdRef.current !== runId) {
                    return;
                }

                setTransitionState("exited");

                const waitTime = exitDuration + exitDelay;

                if (waitTime <= 0) {
                    onExitEnd?.();

                    if (!keepMounted) {
                        setIsRendered(false);
                    }

                    return;
                }

                timeoutRef.current = window.setTimeout(() => {
                    if (runIdRef.current !== runId) {
                        return;
                    }

                    onExitEnd?.();

                    if (!keepMounted) {
                        setIsRendered(false);
                    }
                }, waitTime);
            });
        }, [
            appear,
            clearScheduled,
            enterDelay,
            enterDuration,
            exitDelay,
            exitDuration,
            isRendered,
            keepMounted,
            mounted,
            onEnterEnd,
            onEnterStart,
            onExitEnd,
            onExitStart,
            setTransitionState,
            shouldReduceMotion
        ]);

        useEffect(() => {
            return () => {
                runIdRef.current += 1;
                clearScheduled();
            };
        }, [clearScheduled]);

        const transitionDefinition = useMemo(
            () => resolveTransitionDefinition(transition),
            [transition]
        );

        const resolvedProperties = useMemo(() => {
            if (properties === "auto") {
                return collectTransitionProperties(transitionDefinition);
            }

            return properties;
        }, [properties, transitionDefinition]);

        const currentStyle =
            state === "entering"
                ? transitionDefinition.enterFrom
                : state === "entered"
                  ? transitionDefinition.enterTo
                  : state === "exiting"
                    ? transitionDefinition.exitFrom
                    : transitionDefinition.exitTo;

        const activeDuration =
            direction === "enter" ? enterDuration : exitDuration;
        const activeDelay = direction === "enter" ? enterDelay : exitDelay;
        const activeEasing = direction === "enter" ? enterEasing : exitEasing;

        const effectiveDuration = shouldReduceMotion ? 0 : activeDuration;
        const effectiveDelay = shouldReduceMotion ? 0 : activeDelay;

        const transitionCSS = resolvedProperties.length
            ? resolvedProperties
                  .map(
                      (property) =>
                          `${property} ${effectiveDuration}ms ${activeEasing} ${effectiveDelay}ms`
                  )
                  .join(", ")
            : "none";

        const mergedStyle: CSSProperties = {
            ...style,
            ...currentStyle,
            transition: transitionCSS,
            ...(useGPU && resolvedProperties.length > 0
                ? { willChange: resolvedProperties.join(", ") }
                : {})
        };

        const content =
            typeof children === "function" ? children(state) : children;

        if (!isRendered) {
            return null;
        }

        const mergedRef = (node: HTMLDivElement | null) => {
            if (!ref) {
                return;
            }

            if (typeof ref === "function") {
                ref(node);
                return;
            }

            (ref as { current: HTMLDivElement | null }).current = node;
        };

        return (
            <Component
                id={_id}
                ref={mergedRef}
                className={className}
                style={mergedStyle}
                data-transition-state={state}
                data-transition-direction={direction}
                {...props}
            >
                {content}
            </Component>
        );
    }
);

Transition.displayName = "@refraktor/core/Transition";
Transition.configure = createComponentConfig<TransitionProps>();

export default Transition;
