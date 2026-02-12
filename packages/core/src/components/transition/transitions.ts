import { CSSProperties } from "react";
import {
    TransitionDefinition,
    TransitionPreset
} from "./transition.types";

const NON_ANIMATABLE_PROPERTIES = new Set([
    "display",
    "position",
    "overflow",
    "overflow-x",
    "overflow-y",
    "pointer-events",
    "z-index"
]);

const toKebabCase = (value: string): string =>
    value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const collectProperties = (...styles: Array<CSSProperties | undefined>) => {
    const unique = new Set<string>();

    styles.forEach((style) => {
        if (!style) {
            return;
        }

        Object.keys(style).forEach((key) => {
            const property = toKebabCase(key);

            if (!NON_ANIMATABLE_PROPERTIES.has(property)) {
                unique.add(property);
            }
        });
    });

    return [...unique];
};

export type DefineTransitionInput = {
    enterFrom?: CSSProperties;
    enterTo?: CSSProperties;
    exitFrom?: CSSProperties;
    exitTo?: CSSProperties;
    properties?: "auto" | string[];
};

export function defineTransition({
    enterFrom = {},
    enterTo = {},
    exitFrom,
    exitTo,
    properties = "auto"
}: DefineTransitionInput): TransitionDefinition {
    const resolvedExitFrom = exitFrom ?? enterTo;
    const resolvedExitTo = exitTo ?? enterFrom;

    return {
        enterFrom,
        enterTo,
        exitFrom: resolvedExitFrom,
        exitTo: resolvedExitTo,
        properties:
            properties === "auto"
                ? collectProperties(
                      enterFrom,
                      enterTo,
                      resolvedExitFrom,
                      resolvedExitTo
                  )
                : properties
    };
}

const transitions: Record<TransitionPreset, TransitionDefinition> = {
    fade: defineTransition({
        enterFrom: { opacity: 0 },
        enterTo: { opacity: 1 },
        properties: ["opacity"]
    }),
    scale: defineTransition({
        enterFrom: { opacity: 0, transform: "scale(0.95)" },
        enterTo: { opacity: 1, transform: "scale(1)" },
        properties: ["opacity", "transform"]
    }),
    "slide-up": defineTransition({
        enterFrom: { opacity: 0, transform: "translateY(10px)" },
        enterTo: { opacity: 1, transform: "translateY(0)" },
        properties: ["opacity", "transform"]
    }),
    "slide-down": defineTransition({
        enterFrom: { opacity: 0, transform: "translateY(-10px)" },
        enterTo: { opacity: 1, transform: "translateY(0)" },
        properties: ["opacity", "transform"]
    }),
    "slide-left": defineTransition({
        enterFrom: { opacity: 0, transform: "translateX(10px)" },
        enterTo: { opacity: 1, transform: "translateX(0)" },
        properties: ["opacity", "transform"]
    }),
    "slide-right": defineTransition({
        enterFrom: { opacity: 0, transform: "translateX(-10px)" },
        enterTo: { opacity: 1, transform: "translateX(0)" },
        properties: ["opacity", "transform"]
    }),
    zoom: defineTransition({
        enterFrom: { opacity: 0, transform: "scale(0.8)" },
        enterTo: { opacity: 1, transform: "scale(1)" },
        properties: ["opacity", "transform"]
    }),
    collapse: defineTransition({
        enterFrom: {
            opacity: 0,
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px",
            overflow: "hidden"
        },
        enterTo: {
            opacity: 1,
            transform: "scaleY(1)",
            transformOrigin: "top",
            maxHeight: "1000px",
            overflow: "hidden"
        },
        properties: ["opacity", "transform", "max-height"]
    }),
    blur: defineTransition({
        enterFrom: { opacity: 0, filter: "blur(8px)" },
        enterTo: { opacity: 1, filter: "blur(0px)" },
        properties: ["opacity", "filter"]
    }),
    rotate: defineTransition({
        enterFrom: { opacity: 0, transform: "rotate(-10deg) scale(0.95)" },
        enterTo: { opacity: 1, transform: "rotate(0deg) scale(1)" },
        properties: ["opacity", "transform"]
    })
};

export default transitions;
