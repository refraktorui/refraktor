import { useUncontrolled } from "@refraktor/utils";
import {
    TooltipMiddlewares,
    TooltipPositioning,
    TooltipTrigger
} from "./tooltip.types";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingContext,
    inline,
    Middleware,
    offset,
    Placement,
    shift,
    Strategy,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { useCallback, useMemo, useRef } from "react";

interface UseTooltipProps {
    opened?: boolean;
    defaultOpened?: boolean;
    onOpenedChange?: (opened: boolean) => void;
    positioning?: TooltipPositioning;
    strategy?: Strategy;
    middlewares?: TooltipMiddlewares;
    disabled?: boolean;
    trigger?: TooltipTrigger;
    showArrow?: boolean;
    openDelay?: number;
    closeDelay?: number;
}

export interface UseTooltipReturn {
    opened: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    context: FloatingContext;
    refs: {
        setReference: (node: HTMLElement | null) => void;
        setFloating: (node: HTMLElement | null) => void;
        reference: React.MutableRefObject<HTMLElement | null>;
        floating: React.MutableRefObject<HTMLElement | null>;
    };
    floatingStyles: React.CSSProperties;
    getReferenceProps: (
        userProps?: React.HTMLAttributes<HTMLElement>
    ) => Record<string, unknown>;
    getFloatingProps: (
        userProps?: React.HTMLAttributes<HTMLElement>
    ) => Record<string, unknown>;
    arrowRef: React.RefObject<SVGSVGElement | null>;
    placement: Placement;
}

export function useTooltip(options: UseTooltipProps = {}): UseTooltipReturn {
    const {
        opened,
        defaultOpened,
        onOpenedChange,
        positioning = {
            placement: "top",
            offset: 8
        },
        strategy = "fixed",
        middlewares = { flip: true, shift: true, inline: true },
        disabled = false,
        trigger = "hover",
        showArrow = false,
        openDelay = 0,
        closeDelay = 0
    } = options;

    const arrowRef = useRef<SVGSVGElement>(null);

    const [isOpen, setIsOpen] = useUncontrolled({
        value: opened,
        defaultValue: defaultOpened,
        finalValue: false,
        onChange: onOpenedChange
    });

    const middleware = useMemo(() => {
        const middleware: Middleware[] = [];

        middleware.push(offset(positioning.offset ?? 8));

        if (middlewares.flip) {
            middleware.push(
                flip(
                    typeof middlewares.flip === "boolean"
                        ? undefined
                        : middlewares.flip
                )
            );
        }

        if (middlewares.shift) {
            middleware.push(
                shift(
                    typeof middlewares.shift === "boolean"
                        ? undefined
                        : middlewares.shift
                )
            );
        }

        if (middlewares.inline) {
            middleware.push(
                inline(
                    typeof middlewares.inline === "boolean"
                        ? undefined
                        : middlewares.inline
                )
            );
        }

        if (arrowRef.current && showArrow) {
            middleware.push(
                arrow({
                    element: arrowRef.current
                })
            );
        }

        return middleware;
    }, [positioning.offset, middlewares, showArrow, arrowRef]);

    const floating = useFloating({
        placement: positioning.placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: middleware,
        whileElementsMounted: autoUpdate,
        strategy
    });

    const hover = useHover(floating.context, {
        enabled: trigger === "hover" && !disabled,
        delay: {
            open: openDelay,
            close: closeDelay
        }
    });

    const focus = useFocus(floating.context, {
        enabled: trigger === "focus" && !disabled
    });

    const dismiss = useDismiss(floating.context);

    const role = useRole(floating.context, {
        role: "tooltip"
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role
    ]);

    const open = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const toggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [setIsOpen, isOpen]);

    return {
        opened: isOpen,
        open,
        close,
        toggle,
        context: floating.context,
        refs: {
            setReference: floating.refs.setReference,
            setFloating: floating.refs.setFloating,
            reference: floating.refs
                .reference as React.MutableRefObject<HTMLElement | null>,
            floating: floating.refs
                .floating as React.MutableRefObject<HTMLElement | null>
        },
        floatingStyles: floating.floatingStyles,
        getReferenceProps,
        getFloatingProps,
        placement: floating.placement,
        arrowRef
    };
}
