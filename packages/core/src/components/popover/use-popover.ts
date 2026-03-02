import { useUncontrolled } from "@refraktor/utils";
import {
    PopoverMiddlewares,
    PopoverPositioning,
    PopoverTrigger
} from "./popover.types";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingContext,
    inline,
    Middleware,
    offset,
    Placement,
    safePolygon,
    shift,
    Strategy,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { useCallback, useMemo, useRef } from "react";

interface UsePopoverProps {
    opened?: boolean;
    defaultOpened?: boolean;
    onOpenedChange?: (opened: boolean) => void;
    positioning?: PopoverPositioning;
    strategy?: Strategy;
    middlewares?: PopoverMiddlewares;
    disabled?: boolean;
    trigger?: PopoverTrigger;
    showArrow?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    openDelay?: number;
    closeDelay?: number;
}

export interface UsePopoverReturn {
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

export function usePopover(options: UsePopoverProps = {}): UsePopoverReturn {
    const {
        opened,
        defaultOpened,
        onOpenedChange,
        positioning = {
            placement: "bottom",
            offset: 8
        },
        strategy = "fixed",
        middlewares = { flip: true, shift: true },
        disabled = false,
        trigger = "click",
        showArrow = false,
        closeOnClickOutside = true,
        closeOnEscape = true,
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
        const middlewareList: Middleware[] = [];

        middlewareList.push(offset(positioning.offset ?? 8));

        if (middlewares.flip) {
            middlewareList.push(
                flip(
                    typeof middlewares.flip === "boolean"
                        ? undefined
                        : middlewares.flip
                )
            );
        }

        if (middlewares.shift) {
            middlewareList.push(
                shift(
                    typeof middlewares.shift === "boolean"
                        ? undefined
                        : middlewares.shift
                )
            );
        }

        if (middlewares.inline) {
            middlewareList.push(
                inline(
                    typeof middlewares.inline === "boolean"
                        ? undefined
                        : middlewares.inline
                )
            );
        }

        if (showArrow) {
            middlewareList.push(
                arrow({
                    element: arrowRef
                })
            );
        }

        return middlewareList;
    }, [positioning.offset, middlewares, showArrow, arrowRef]);

    const floating = useFloating({
        placement: positioning.placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: middleware,
        whileElementsMounted: autoUpdate,
        strategy
    });

    const click = useClick(floating.context, {
        enabled: trigger === "click" && !disabled
    });

    const hover = useHover(floating.context, {
        enabled: trigger === "hover" && !disabled,
        handleClose: safePolygon(),
        delay: {
            open: openDelay,
            close: closeDelay
        }
    });

    const focus = useFocus(floating.context, {
        enabled: trigger === "focus" && !disabled
    });

    const dismiss = useDismiss(floating.context, {
        outsidePress: closeOnClickOutside,
        escapeKey: closeOnEscape
    });

    const role = useRole(floating.context, {
        role: "dialog"
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        hover,
        focus,
        dismiss,
        role
    ]);

    const open = useCallback(() => {
        if (!disabled) {
            setIsOpen(true);
        }
    }, [setIsOpen, disabled]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const toggle = useCallback(() => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    }, [setIsOpen, isOpen, disabled]);

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
