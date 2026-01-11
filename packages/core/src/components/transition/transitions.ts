import { CSSProperties } from "react";
import { Transitions, TransitionStyles } from "./transition.types";

/**
 * Creates a custom transition with automatic property detection
 * @param from - Initial state styles (exited/entering) - where the element enters FROM
 * @param to - Final state styles (entered) - the resting state
 * @param exitTo - Optional exit state styles (exiting) - where the element exits TO. If not provided, uses `from` (symmetric transition)
 * @returns TransitionStyles object with all states and detected properties
 */
export function createTransition(
    from: CSSProperties,
    to: CSSProperties,
    exitTo?: CSSProperties
): TransitionStyles & { __properties?: string[] } {
    const allKeys = new Set([
        ...Object.keys(from),
        ...Object.keys(to),
        ...(exitTo ? Object.keys(exitTo) : [])
    ]);
    const properties: string[] = [];

    const toKebabCase = (str: string): string =>
        str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

    allKeys.forEach((key) => {
        const animatableProps = [
            "opacity",
            "transform",
            "filter",
            "maxHeight",
            "max-height",
            "width",
            "height",
            "color",
            "backgroundColor",
            "background-color",
            "borderColor",
            "border-color",
            "scale",
            "rotate",
            "translate"
        ];

        const kebabKey = toKebabCase(key);
        if (
            animatableProps.includes(key) ||
            animatableProps.includes(kebabKey)
        ) {
            properties.push(kebabKey);
        }
    });

    return {
        exited: exitTo ?? from,
        entering: from,
        entered: to,
        exiting: exitTo ?? from,
        __properties: properties.length > 0 ? properties : undefined
    };
}

const transitions: Record<Transitions, TransitionStyles> = {
    fade: {
        exited: { opacity: 0 },
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 }
    },
    scale: {
        exited: { transform: "scale(0.95)" },
        entering: { transform: "scale(0.95)" },
        entered: { transform: "scale(1)" },
        exiting: { transform: "scale(0.95)" }
    },
    "slide-up": {
        exited: { transform: "translateY(10px)" },
        entering: { transform: "translateY(10px)" },
        entered: { transform: "translateY(0)" },
        exiting: { transform: "translateY(10px)" }
    },
    "slide-down": {
        exited: { transform: "translateY(-10px)" },
        entering: { transform: "translateY(-10px)" },
        entered: { transform: "translateY(0)" },
        exiting: { transform: "translateY(-10px)" }
    },
    "slide-left": {
        exited: { transform: "translateX(10px)" },
        entering: { transform: "translateX(10px)" },
        entered: { transform: "translateX(0)" },
        exiting: { transform: "translateX(10px)" }
    },
    "slide-right": {
        exited: { transform: "translateX(-10px)" },
        entering: { transform: "translateX(-10px)" },
        entered: { transform: "translateX(0)" },
        exiting: { transform: "translateX(-10px)" }
    },
    zoom: {
        exited: { transform: "scale(0.8)" },
        entering: { transform: "scale(0.8)" },
        entered: { transform: "scale(1)" },
        exiting: { transform: "scale(0.8)" }
    },
    collapse: {
        exited: {
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px",
            overflow: "hidden"
        },
        entering: {
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px",
            overflow: "hidden"
        },
        entered: {
            transform: "scaleY(1)",
            transformOrigin: "top",
            maxHeight: "1000px",
            overflow: "hidden"
        },
        exiting: {
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px",
            overflow: "hidden"
        }
    },
    blur: {
        exited: { filter: "blur(8px)" },
        entering: { filter: "blur(8px)" },
        entered: { filter: "blur(0px)" },
        exiting: { filter: "blur(8px)" }
    },
    rotate: {
        exited: { transform: "rotate(-10deg) scale(0.95)" },
        entering: { transform: "rotate(-10deg) scale(0.95)" },
        entered: { transform: "rotate(0deg) scale(1)" },
        exiting: { transform: "rotate(-10deg) scale(0.95)" }
    }
};

export default transitions;
