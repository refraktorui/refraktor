import { createOptionalContext } from "@refraktor/utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";

export interface CheckboxGroupContextValue {
    value: string[];
    onValueChange: (checkboxValue: string, checked: boolean) => void;
    name?: string;
    disabled?: boolean;
    size?: RefraktorSize;
    radius?: RefraktorRadius;
}

export const [CheckboxGroupProvider, useCheckboxGroupContext] =
    createOptionalContext<CheckboxGroupContextValue>();
