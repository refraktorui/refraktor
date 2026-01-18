import { createSafeContext } from "@refraktor/utils";
import { UsePopoverReturn } from "./use-popover";
import { PopoverClassNames } from "./popover.types";
import { RefraktorRadius } from "../../theme";
import { TransitionProps } from "../transition";

export interface PopoverContextValue {
    popover: UsePopoverReturn;
    showArrow: boolean;
    radius: RefraktorRadius;
    withinPortal: boolean;
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;
    classNames?: PopoverClassNames;
    getStyles: (part: keyof PopoverClassNames) => string | undefined;
}

export const [PopoverProvider, usePopoverContext] =
    createSafeContext<PopoverContextValue>(
        "Popover component was not found in tree. Make sure you wrap Popover.Trigger and Popover.Dropdown with Popover component."
    );
