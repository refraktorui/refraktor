import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { InputFieldClassNames, InputProps } from "../input";

export type NumberInputControlsPosition = "left" | "right" | "none";

export interface NumberInputClassNames extends InputFieldClassNames {
    controls?: string;
    increment?: string;
    decrement?: string;
    [key: string]: string | undefined;
}

export interface _NumberInputProps {
    /** Value (controlled) */
    value?: string | number;

    /** Default value (uncontrolled) */
    defaultValue?: string | number;

    /** Callback called when the value changes */
    onChange?: (value: string | number) => void;

    /** Minimum value */
    min?: number;

    /** Maximum value */
    max?: number;

    /** Step value */
    step?: number;

    /** Number of decimal places for the value */
    precision?: number;

    /** Position of the controls @default `right` */
    controlsPosition?: NumberInputControlsPosition;

    /** Used for styling different parts of the component */
    classNames?: NumberInputClassNames;
}

export type NumberInputProps = _NumberInputProps &
    Omit<InputProps, "onChange" | "type" | keyof _NumberInputProps>;

export interface NumberInputFactoryPayload extends FactoryPayload {
    props: NumberInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<NumberInputProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<NumberInputClassNames>
        >;
    };
}
