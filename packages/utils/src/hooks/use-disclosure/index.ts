import { useCallback, useMemo, useState } from "react";

export interface UseDisclosureCallbacks {
    onOpen?: () => void;
    onClose?: () => void;
}

export interface UseDisclosureHandlers {
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export type UseDisclosureReturn = [boolean, UseDisclosureHandlers];

export function useDisclosure(
    initialState = false,
    callbacks?: UseDisclosureCallbacks
): UseDisclosureReturn {
    const [opened, setOpened] = useState(initialState);
    const { onOpen, onClose } = callbacks ?? {};

    const open = useCallback(() => {
        setOpened((isOpened) => {
            if (!isOpened) {
                onOpen?.();
            }

            return true;
        });
    }, [onOpen]);

    const close = useCallback(() => {
        setOpened((isOpened) => {
            if (isOpened) {
                onClose?.();
            }

            return false;
        });
    }, [onClose]);

    const toggle = useCallback(() => {
        setOpened((isOpened) => {
            const next = !isOpened;

            if (next) {
                onOpen?.();
            } else {
                onClose?.();
            }

            return next;
        });
    }, [onOpen, onClose]);

    const handlers = useMemo(
        () => ({
            open,
            close,
            toggle
        }),
        [open, close, toggle]
    );

    return [opened, handlers];
}
