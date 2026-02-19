import { useUncontrolled } from "@refraktor/utils";
import { useCallback, useEffect } from "react";

interface UseDrawerProps {
    opened?: boolean;
    defaultOpened?: boolean;
    onOpenedChange?: (opened: boolean) => void;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    contentRef: React.MutableRefObject<HTMLElement | null>;
}

export interface UseDrawerReturn {
    opened: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export function useDrawer(options: UseDrawerProps): UseDrawerReturn {
    const {
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside = true,
        closeOnEscape = true,
        contentRef
    } = options;

    const [isOpen, setIsOpen] = useUncontrolled({
        value: opened,
        defaultValue: defaultOpened,
        finalValue: false,
        onChange: onOpenedChange
    });

    const open = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const toggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (!isOpen || !closeOnEscape) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeOnEscape, isOpen, setIsOpen]);

    useEffect(() => {
        if (!isOpen || !closeOnClickOutside) {
            return;
        }

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (contentRef.current?.contains(target)) {
                return;
            }

            setIsOpen(false);
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };
    }, [closeOnClickOutside, contentRef, isOpen, setIsOpen]);

    return {
        opened: isOpen,
        open,
        close,
        toggle
    };
}
