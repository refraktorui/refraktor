import { createContext, useContext } from "react";
import type { DatesContextValue } from "./types";

const DatesContext = createContext<DatesContextValue | null>(null);

export const DatesContextProvider = DatesContext.Provider;

export const useDatesContext = () => {
    const context = useContext(DatesContext);

    if (context === null) {
        throw new Error(
            "[@refraktor/dates] DatesProvider was not found in the tree"
        );
    }

    return context;
};
