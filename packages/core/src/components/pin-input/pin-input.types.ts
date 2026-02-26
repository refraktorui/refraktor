import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { InputProps } from "../input";

export type PinInputCharacterSet =
    | "numeric"
    | "alphabetic"
    | "alphanumeric"
    | "all";

export type PinInputTransform = "none" | "uppercase" | "lowercase";

export type PinInputClassNames = {
    root?: string;
    cell?: string;
};

export interface _PinInputProps {
    /** OTP length @default `6` */
    length?: number;

    /** Value (controlled) */
    value?: string;

    /** Default value (uncontrolled) */
    defaultValue?: string;

    /** Callback called whenever the code value changes */
    onChange?: (value: string) => void;

    /** Callback called when all cells are filled */
    onComplete?: (value: string) => void;

    /** Masks entered characters @default `false` */
    mask?: boolean;

    /** Character set filter @default `numeric` */
    characterSet?: PinInputCharacterSet;

    /** Optional custom character pattern (overrides characterSet) */
    characterPattern?: RegExp;

    /** Character transform @default `none` */
    transform?: PinInputTransform;

    /** Accessible label prefix for each cell @default `Character` */
    ariaLabelPrefix?: string;

    /** Hidden input name for form submission */
    name?: string;

    /** Used for styling different parts of the component */
    classNames?: PinInputClassNames;
}

export type PinInputProps = _PinInputProps &
    Omit<
        InputProps,
        | "type"
        | "value"
        | "defaultValue"
        | "onChange"
        | "leftSection"
        | "rightSection"
        | "maxLength"
    >;

export interface PinInputFactoryPayload extends FactoryPayload {
    props: PinInputProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PinInputProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<PinInputClassNames>>;
    };
}
