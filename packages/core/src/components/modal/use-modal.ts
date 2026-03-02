import { useUncontrolled } from "@refraktor/utils";
import {
    FloatingContext,
    useDismiss,
    useFloating,
    useInteractions,
    useRole
} from "@floating-ui/react";
import type { Strategy } from "@floating-ui/react";
import { useCallback } from "react";

interface UseModalProps {
    opened?: boolean;
    defaultOpened?: boolean;
    onOpenedChange?: (opened: boolean) => void;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    strategy?: Strategy;
}

export interface UseModalReturn {
    opened: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    context: FloatingContext;
    refs: {
        setReference: (node: HTMLElement | null) => void;
        setFloating: (node: HTMLElement | null) => void;
        floating: React.MutableRefObject<HTMLElement | null>;
    };
    getFloatingProps: (
        userProps?: React.HTMLAttributes<HTMLElement>
    ) => Record<string, unknown>;
}

export function useModal(options: UseModalProps): UseModalReturn {
    const {
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside = true,
        closeOnEscape = true,
        strategy = "absolute"
    } = options;

    const [isOpen, setIsOpen] = useUncontrolled({
        value: opened,
        defaultValue: defaultOpened,
        finalValue: false,
        onChange: onOpenedChange
    });

    const floating = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        strategy
    });

    const dismiss = useDismiss(floating.context, {
        outsidePress: closeOnClickOutside,
        outsidePressEvent: "mousedown",
        escapeKey: closeOnEscape
    });

    const role = useRole(floating.context, {
        role: "dialog"
    });

    const { getFloatingProps } = useInteractions([dismiss, role]);

    const open = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const toggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen, setIsOpen]);

    return {
        opened: isOpen,
        open,
        close,
        toggle,
        context: floating.context,
        refs: {
            setReference: floating.refs.setReference,
            setFloating: floating.refs.setFloating,
            floating: floating.refs
                .floating as React.MutableRefObject<HTMLElement | null>
        },
        getFloatingProps
    };
}
