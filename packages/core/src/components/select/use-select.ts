import { useUncontrolled } from "@refraktor/utils";
import {
    autoUpdate,
    flip,
    FloatingContext,
    inline,
    Middleware,
    offset,
    Placement,
    shift,
    Strategy,
    useClick,
    useDismiss,
    useFloating,
    useInteractions
} from "@floating-ui/react";
import { useCallback, useMemo } from "react";
import type { SelectMiddlewares, SelectPositioning } from "./select.types";

interface UseSelectProps {
    opened?: boolean;
    defaultOpened?: boolean;
    onOpenedChange?: (opened: boolean) => void;
    positioning?: SelectPositioning;
    strategy?: Strategy;
    middlewares?: SelectMiddlewares;
    disabled?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
}

export interface UseSelectReturn {
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
    placement: Placement;
}

export function useSelect(options: UseSelectProps = {}): UseSelectReturn {
    const {
        opened,
        defaultOpened,
        onOpenedChange,
        positioning = {
            placement: "bottom-start",
            offset: 4
        },
        strategy = "fixed",
        middlewares = { flip: true, shift: true },
        disabled = false,
        closeOnClickOutside = true,
        closeOnEscape = true
    } = options;

    const [isOpen, setIsOpen] = useUncontrolled({
        value: opened,
        defaultValue: defaultOpened,
        finalValue: false,
        onChange: onOpenedChange
    });

    const middleware = useMemo(() => {
        const middlewareList: Middleware[] = [];

        middlewareList.push(offset(positioning.offset ?? 4));

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

        return middlewareList;
    }, [positioning.offset, middlewares]);

    const floating = useFloating({
        placement: positioning.placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware,
        whileElementsMounted: autoUpdate,
        strategy
    });

    const click = useClick(floating.context, {
        enabled: !disabled
    });

    const dismiss = useDismiss(floating.context, {
        outsidePress: closeOnClickOutside,
        escapeKey: closeOnEscape
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss
    ]);

    const open = useCallback(() => {
        if (!disabled) {
            setIsOpen(true);
        }
    }, [disabled, setIsOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const toggle = useCallback(() => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    }, [disabled, isOpen, setIsOpen]);

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
        placement: floating.placement
    };
}
