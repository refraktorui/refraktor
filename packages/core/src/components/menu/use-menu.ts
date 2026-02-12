import { useUncontrolled } from "@refraktor/utils";
import {
    autoUpdate,
    flip,
    FloatingContext,
    inline,
    Middleware,
    offset,
    Placement,
    safePolygon,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { useCallback, useMemo } from "react";
import {
    MenuMiddlewares,
    MenuPositioning,
    MenuTriggerType
} from "./menu.types";

interface UseMenuProps {
    opened?: boolean;
    defaultOpened?: boolean;
    onOpenedChange?: (opened: boolean) => void;
    positioning?: MenuPositioning;
    middlewares?: MenuMiddlewares;
    disabled?: boolean;
    trigger?: MenuTriggerType;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    openDelay?: number;
    closeDelay?: number;
}

export interface UseMenuReturn {
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

export function useMenu(options: UseMenuProps = {}): UseMenuReturn {
    const {
        opened,
        defaultOpened,
        onOpenedChange,
        positioning = {
            placement: "bottom-start",
            offset: 4
        },
        middlewares = { flip: true, shift: true },
        disabled = false,
        trigger = "click",
        closeOnClickOutside = true,
        closeOnEscape = true,
        openDelay = 0,
        closeDelay = 100
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
        whileElementsMounted: autoUpdate
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
        role: "menu"
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
        placement: floating.placement
    };
}
