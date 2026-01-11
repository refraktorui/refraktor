import { Transitions, TransitionStyles } from "./transition.types";

const transitions: Record<Transitions, TransitionStyles> = {
    fade: {
        exited: { opacity: 0 },
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 }
    },
    scale: {
        exited: { opacity: 0, transform: "scale(0.95)" },
        entering: { opacity: 0, transform: "scale(0.95)" },
        entered: { opacity: 1, transform: "scale(1)" },
        exiting: { opacity: 0, transform: "scale(0.95)" }
    },
    "slide-up": {
        exited: { opacity: 0, transform: "translateY(10px)" },
        entering: { opacity: 0, transform: "translateY(10px)" },
        entered: { opacity: 1, transform: "translateY(0)" },
        exiting: { opacity: 0, transform: "translateY(10px)" }
    },
    "slide-down": {
        exited: { opacity: 0, transform: "translateY(-10px)" },
        entering: { opacity: 0, transform: "translateY(-10px)" },
        entered: { opacity: 1, transform: "translateY(0)" },
        exiting: { opacity: 0, transform: "translateY(-10px)" }
    },
    "slide-left": {
        exited: { opacity: 0, transform: "translateX(10px)" },
        entering: { opacity: 0, transform: "translateX(10px)" },
        entered: { opacity: 1, transform: "translateX(0)" },
        exiting: { opacity: 0, transform: "translateX(10px)" }
    },
    "slide-right": {
        exited: { opacity: 0, transform: "translateX(-10px)" },
        entering: { opacity: 0, transform: "translateX(-10px)" },
        entered: { opacity: 1, transform: "translateX(0)" },
        exiting: { opacity: 0, transform: "translateX(-10px)" }
    },
    zoom: {
        exited: { opacity: 0, transform: "scale(0.8)" },
        entering: { opacity: 0, transform: "scale(0.8)" },
        entered: { opacity: 1, transform: "scale(1)" },
        exiting: { opacity: 0, transform: "scale(0.8)" }
    },
    collapse: {
        exited: {
            opacity: 0,
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px"
        },
        entering: {
            opacity: 0,
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px"
        },
        entered: {
            opacity: 1,
            transform: "scaleY(1)",
            transformOrigin: "top",
            maxHeight: "1000px"
        },
        exiting: {
            opacity: 0,
            transform: "scaleY(0)",
            transformOrigin: "top",
            maxHeight: "0px"
        }
    },
    blur: {
        exited: { opacity: 0, filter: "blur(8px)" },
        entering: { opacity: 0, filter: "blur(8px)" },
        entered: { opacity: 1, filter: "blur(0px)" },
        exiting: { opacity: 0, filter: "blur(8px)" }
    },
    rotate: {
        exited: { opacity: 0, transform: "rotate(-10deg) scale(0.95)" },
        entering: { opacity: 0, transform: "rotate(-10deg) scale(0.95)" },
        entered: { opacity: 1, transform: "rotate(0deg) scale(1)" },
        exiting: { opacity: 0, transform: "rotate(-10deg) scale(0.95)" }
    }
};

export default transitions;
