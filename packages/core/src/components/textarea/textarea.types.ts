import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import { createComponentConfig, FactoryPayload } from "../../utils";
import { InputWrapperProps, InputVariant } from "../input";
import { TextareaField } from "./textarea-field";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export type TextareaFieldClassNames = {
    root?: string;
};

export interface TextareaFieldProps extends Omit<
    ComponentPropsWithoutRef<"textarea">,
    "size"
> {
    /** Textarea variant @default `default` */
    variant?: InputVariant;

    /** Textarea size @default `md` */
    size?: RefraktorSize;

    /** Textarea radius @default `default` */
    radius?: RefraktorRadius;

    /** Error state */
    error?: boolean;

    /** Used for editing root class name */
    className?: string;

    /** Class names for sub-elements */
    classNames?: TextareaFieldClassNames;

    /** Enable auto-resizing based on content @default false */
    autosize?: boolean;

    /** Minimum number of rows (only works with autosize) @default 2 */
    minRows?: number;

    /** Maximum number of rows (only works with autosize) */
    maxRows?: number;

    /** Controls the resize behavior @default `none` when autosize, `vertical` otherwise */
    resize?: TextareaResize;
}

export interface TextareaProps extends Omit<TextareaFieldProps, "error"> {
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
}

export interface TextareaFactoryPayload extends FactoryPayload {
    props: TextareaProps;
    ref: HTMLTextAreaElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TextareaProps>>;
        Field: typeof TextareaField;
    };
}

export interface TextareaFieldFactoryPayload extends FactoryPayload {
    props: TextareaFieldProps;
    ref: HTMLTextAreaElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TextareaFieldProps>>;
    };
}
