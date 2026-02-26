import { createSafeContext } from "@refraktor/utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import { TransitionProps } from "../transition";
import { DrawerClassNames, DrawerPosition } from "./drawer.types";
import { UseDrawerReturn } from "./use-drawer";

export interface DrawerContextValue {
    drawer: UseDrawerReturn;
    closeOnClickOutside: boolean;
    lockScroll: boolean;
    withinPortal: boolean;
    radius: RefraktorRadius;
    position: DrawerPosition;
    size: RefraktorSize;
    trapFocus: boolean;
    returnFocus: boolean;
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;
    headerId: string;
    classNames?: DrawerClassNames;
    getStyles: (part: keyof DrawerClassNames) => string | undefined;
}

export const [DrawerProvider, useDrawerContext] =
    createSafeContext<DrawerContextValue>(
        "Drawer context was not found in tree. Make sure Drawer subcomponents are wrapped with Drawer or DrawerRoot."
    );
