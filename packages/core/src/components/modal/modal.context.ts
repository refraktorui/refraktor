import { createSafeContext } from "@refraktor/utils";
import { RefraktorRadius } from "../../theme";
import { TransitionProps } from "../transition";
import { ModalClassNames, ModalSize } from "./modal.types";
import { UseModalReturn } from "./use-modal";

export interface ModalContextValue {
    modal: UseModalReturn;
    closeOnClickOutside: boolean;
    lockScroll: boolean;
    withinPortal: boolean;
    radius: RefraktorRadius;
    size: ModalSize;
    centered: boolean;
    trapFocus: boolean;
    returnFocus: boolean;
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;
    headerId: string;
    classNames?: ModalClassNames;
    getStyles: (part: keyof ModalClassNames) => string | undefined;
}

export const [ModalProvider, useModalContext] =
    createSafeContext<ModalContextValue>(
        "Modal context was not found in tree. Make sure Modal subcomponents are wrapped with Modal or ModalRoot."
    );
