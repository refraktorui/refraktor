import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { InputLabel } from "./input-label";
import { InputDescription } from "./input-description";
import { InputError } from "./input-error";
import { InputField } from "./input-field";
import { InputWrapper } from "./input-wrapper";

export type InputVariant = "default" | "filled" | "outline";

export type InputFieldClassNames = {
    root?: string;
    leftSection?: string;
    rightSection?: string;
};

export interface InputClassNames extends InputFieldClassNames {
    wrapper?: string;
    field?: string;
    label?: string;
    description?: string;
    error?: string;
    [key: string]: string | undefined;
}

export interface InputWrapperProps extends ComponentPropsWithoutRef<"div"> {
    /** Label text */
    label?: ReactNode;

    /** Description text displayed below the label */
    description?: ReactNode;

    /** Error message */
    error?: ReactNode;

    /** Whether the field is required */
    required?: boolean;

    /** Display an asterisk next to the label */
    withAsterisk?: boolean;

    /** Input id for label association */
    inputId?: string;

    /** Children (input field) */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;

    /** Used for editing label class name */
    labelClassName?: string;

    /** Used for editing description class name */
    descriptionClassName?: string;

    /** Used for editing error class name */
    errorClassName?: string;
}

export interface InputFieldProps
    extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
    /** Input variant @default `default` */
    variant?: InputVariant;

    /** Input size @default `md` */
    size?: RefraktorSize;

    /** Input radius @default `md` */
    radius?: RefraktorRadius;

    /** Error state */
    error?: boolean;

    /** Left section content */
    leftSection?: ReactNode;

    /** Right section content */
    rightSection?: ReactNode;

    /** Used for editing root class name */
    className?: string;

    classNames?: InputFieldClassNames;
}

export interface InputProps extends Omit<InputFieldProps, "error" | "classNames"> {
    /** Label text */
    label?: ReactNode;

    /** Description text */
    description?: ReactNode;

    /** Error message */
    error?: ReactNode;

    /** Whether the field is required */
    required?: boolean;

    /** Display an asterisk next to the label */
    withAsterisk?: boolean;

    /** Used for styling different parts of the component */
    classNames?: InputClassNames;
}

export interface InputFactoryPayload extends FactoryPayload {
    props: InputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<InputProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<InputClassNames>>;
        Wrapper: typeof InputWrapper;
        Label: typeof InputLabel;
        Description: typeof InputDescription;
        Error: typeof InputError;
        Field: typeof InputField;
    };
}

export interface InputWrapperFactoryPayload extends FactoryPayload {
    props: InputWrapperProps;
    ref: HTMLDivElement;
}

export interface InputFieldFactoryPayload extends FactoryPayload {
    props: InputFieldProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<InputFieldProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<InputFieldClassNames>
        >;
    };
}
