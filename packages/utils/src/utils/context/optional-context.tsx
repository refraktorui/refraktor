import { createContext, useContext } from "react";

export function createOptionalContext<ContextValue>(
    initialValue: ContextValue | null = null
) {
    const Context = createContext<ContextValue | null>(initialValue);

    const useOptionalContext = () => useContext(Context);

    const Provider = ({
        value,
        children
    }: {
        value: ContextValue;
        children: React.ReactNode;
    }) => {
        return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    return [Provider, useOptionalContext] as const;
}
