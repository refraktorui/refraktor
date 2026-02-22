import { createComponentConfig, FactoryPayload } from "../../utils";
import { InputProps } from "../input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
    /** Whether to render the visibility toggle icon @default `true` */
    withVisibilityToggle?: boolean;

    /** Controls visibility state */
    visible?: boolean;

    /** Initial visibility state */
    defaultVisible?: boolean;

    /** Callback called when visibility changes */
    onVisibilityChange?: (visible: boolean) => void;

    /** Accessible label for showing the password @default `Show password` */
    showPasswordLabel?: string;

    /** Accessible label for hiding the password @default `Hide password` */
    hidePasswordLabel?: string;
}

export interface PasswordInputFactoryPayload extends FactoryPayload {
    props: PasswordInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PasswordInputProps>>;
    };
}
