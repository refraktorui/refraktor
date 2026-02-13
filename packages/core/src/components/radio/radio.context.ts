import { createOptionalContext } from "@refraktor/utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";

export interface RadioGroupContextValue {
    value: string;
    onValueChange: (radioValue: string) => void;
    name?: string;
    disabled?: boolean;
    size?: RefraktorSize;
    radius?: RefraktorRadius;
}

export const [RadioGroupProvider, useRadioGroupContext] =
    createOptionalContext<RadioGroupContextValue>();
