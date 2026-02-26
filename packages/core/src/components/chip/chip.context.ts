import { createOptionalContext } from "@refraktor/utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import { ChipVariant } from "./chip.types";

export interface ChipGroupContextValue {
    value: string[];
    onValueChange: (chipValue: string, selected: boolean) => void;
    disabled?: boolean;
    size?: RefraktorSize;
    radius?: RefraktorRadius;
    variant?: ChipVariant;
}

export const [ChipGroupProvider, useChipGroupContext] =
    createOptionalContext<ChipGroupContextValue>();
