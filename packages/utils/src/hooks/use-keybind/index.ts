import { useEffect, useMemo, useRef } from "react";

type KeybindModifier = "ctrl" | "shift" | "alt" | "meta";

type ParsedKeybind = {
    modifiers: Set<KeybindModifier>;
    key: string | null;
};

export type UseKeybindEvent = "keydown" | "keyup";

export interface UseKeybindOptions {
    enabled?: boolean;
    event?: UseKeybindEvent;
    target?: Window | Document | HTMLElement | null;
    preventDefault?: boolean;
    stopPropagation?: boolean;
    ignoreInputFields?: boolean;
    allowRepeat?: boolean;
}

const MODIFIER_ALIASES: Record<string, KeybindModifier> = {
    ctrl: "ctrl",
    control: "ctrl",
    shift: "shift",
    alt: "alt",
    option: "alt",
    meta: "meta",
    cmd: "meta",
    command: "meta",
    super: "meta",
    win: "meta"
};

const KEY_ALIASES: Record<string, string> = {
    esc: "escape",
    return: "enter",
    del: "delete",
    plus: "+",
    space: " ",
    spacebar: " "
};

function normalizeToken(token: string): string {
    return token.trim().toLowerCase();
}

function normalizeKey(key: string): string {
    const normalized = key.trim().toLowerCase();
    return KEY_ALIASES[normalized] ?? normalized;
}

function parseCombo(combo: string): ParsedKeybind | null {
    const tokens = combo
        .split("+")
        .map((token) => normalizeToken(token))
        .filter(Boolean);

    if (tokens.length === 0) {
        return null;
    }

    const modifiers = new Set<KeybindModifier>();
    let key: string | null = null;

    for (const token of tokens) {
        const modifier = MODIFIER_ALIASES[token];

        if (modifier) {
            modifiers.add(modifier);
            continue;
        }

        if (key !== null) {
            return null;
        }

        key = normalizeKey(token);
    }

    return { modifiers, key };
}

function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    if (target.isContentEditable) {
        return true;
    }

    const tagName = target.tagName;
    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function matchesCombo(event: KeyboardEvent, parsed: ParsedKeybind): boolean {
    if (event.ctrlKey !== parsed.modifiers.has("ctrl")) {
        return false;
    }

    if (event.shiftKey !== parsed.modifiers.has("shift")) {
        return false;
    }

    if (event.altKey !== parsed.modifiers.has("alt")) {
        return false;
    }

    if (event.metaKey !== parsed.modifiers.has("meta")) {
        return false;
    }

    if (parsed.key === null) {
        return true;
    }

    return normalizeKey(event.key) === parsed.key;
}

export function useKeybind(
    combo: string,
    handler: (event: KeyboardEvent) => void,
    options: UseKeybindOptions = {}
): void {
    const {
        enabled = true,
        event: eventName = "keydown",
        target = typeof window !== "undefined" ? window : null,
        preventDefault = false,
        stopPropagation = false,
        ignoreInputFields = true,
        allowRepeat = false
    } = options;

    const parsed = useMemo(() => parseCombo(combo), [combo]);
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        if (!enabled || !target || parsed === null) {
            return;
        }

        const listener = (keyboardEvent: Event) => {
            if (!(keyboardEvent instanceof KeyboardEvent)) {
                return;
            }

            if (!allowRepeat && keyboardEvent.repeat) {
                return;
            }

            if (ignoreInputFields && isTypingTarget(keyboardEvent.target)) {
                return;
            }

            if (!matchesCombo(keyboardEvent, parsed)) {
                return;
            }

            if (preventDefault) {
                keyboardEvent.preventDefault();
            }

            if (stopPropagation) {
                keyboardEvent.stopPropagation();
            }

            handlerRef.current(keyboardEvent);
        };

        target.addEventListener(eventName, listener as EventListener);

        return () => {
            target.removeEventListener(eventName, listener as EventListener);
        };
    }, [
        allowRepeat,
        enabled,
        eventName,
        ignoreInputFields,
        parsed,
        preventDefault,
        stopPropagation,
        target
    ]);
}
