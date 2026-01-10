export interface StorageOptions<T> {
    /** Default value if key doesn't exist */
    defaultValue?: T;

    /** Time-to-live in milliseconds */
    ttl?: number;

    /** Custom serializer function */
    serializer?: (value: T) => string;

    /** Custom deserializer function */
    deserializer?: (value: string) => T;
}

export interface StorageItem<T> {
    value: T;
    expiry?: number;
}

export interface StorageEventPayload<T> {
    key: string;
    oldValue: T | null;
    newValue: T | null;
}

type StorageListener<T> = (payload: StorageEventPayload<T>) => void;

const isBrowser = typeof window !== "undefined";

export function createStorage<T>(key: string, options: StorageOptions<T> = {}) {
    const {
        defaultValue,
        ttl,
        serializer = JSON.stringify,
        deserializer = JSON.parse
    } = options;

    const listeners = new Set<StorageListener<T>>();

    const getFullKey = () => key;

    const get = (): T | null => {
        if (!isBrowser) return defaultValue ?? null;

        try {
            const raw = localStorage.getItem(getFullKey());
            if (raw === null) return defaultValue ?? null;

            const item: StorageItem<T> = deserializer(raw);

            if (item.expiry && Date.now() > item.expiry) {
                remove();
                return defaultValue ?? null;
            }

            return item.value;
        } catch {
            return defaultValue ?? null;
        }
    };

    const set = (value: T): void => {
        if (!isBrowser) return;

        try {
            const oldValue = get();

            const item: StorageItem<T> = {
                value,
                expiry: ttl ? Date.now() + ttl : undefined
            };

            localStorage.setItem(getFullKey(), serializer(item));

            listeners.forEach((listener) =>
                listener({ key: getFullKey(), oldValue, newValue: value })
            );
        } catch (error) {
            console.warn(`Failed to set localStorage key "${key}":`, error);
        }
    };

    const remove = (): void => {
        if (!isBrowser) return;

        const oldValue = get();
        localStorage.removeItem(getFullKey());

        listeners.forEach((listener) =>
            listener({ key: getFullKey(), oldValue, newValue: null })
        );
    };

    const exists = (): boolean => {
        if (!isBrowser) return false;
        return localStorage.getItem(getFullKey()) !== null;
    };

    const subscribe = (listener: StorageListener<T>): (() => void) => {
        listeners.add(listener);

        const handleStorageEvent = (event: StorageEvent) => {
            if (event.key === getFullKey()) {
                try {
                    const oldValue = event.oldValue
                        ? (deserializer(event.oldValue) as StorageItem<T>).value
                        : null;
                    const newValue = event.newValue
                        ? (deserializer(event.newValue) as StorageItem<T>).value
                        : null;
                    listener({ key: getFullKey(), oldValue, newValue });
                } catch {
                    // Ignore parse errors
                }
            }
        };

        if (isBrowser) {
            window.addEventListener("storage", handleStorageEvent);
        }

        return () => {
            listeners.delete(listener);
            if (isBrowser) {
                window.removeEventListener("storage", handleStorageEvent);
            }
        };
    };

    const update = (updater: (current: T | null) => T): void => {
        const current = get();
        set(updater(current));
    };

    return {
        get,
        set,
        remove,
        exists,
        subscribe,
        update,
        key: getFullKey()
    };
}

export const storage = {
    get<T>(key: string, defaultValue?: T): T | null {
        if (!isBrowser) return defaultValue ?? null;

        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return defaultValue ?? null;

            const parsed = JSON.parse(raw);

            if (parsed && typeof parsed === "object" && "value" in parsed) {
                if (parsed.expiry && Date.now() > parsed.expiry) {
                    localStorage.removeItem(key);
                    return defaultValue ?? null;
                }
                return parsed.value;
            }

            return parsed;
        } catch {
            return defaultValue ?? null;
        }
    },

    set<T>(key: string, value: T, ttl?: number): void {
        if (!isBrowser) return;

        try {
            const item: StorageItem<T> = {
                value,
                expiry: ttl ? Date.now() + ttl : undefined
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.warn(`Failed to set localStorage key "${key}":`, error);
        }
    },

    remove(key: string): void {
        if (!isBrowser) return;
        localStorage.removeItem(key);
    },

    clear(): void {
        if (!isBrowser) return;
        localStorage.clear();
    },

    keys(): string[] {
        if (!isBrowser) return [];
        return Object.keys(localStorage);
    },

    size(): number {
        if (!isBrowser) return 0;
        return localStorage.length;
    }
};
