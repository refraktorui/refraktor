import { ButtonHTMLAttributes, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    PolymorphicFactoryPayload
} from "../../utils";

export type ButtonSize =
    | RefraktorSize
    | "icon-xs"
    | "icon-sm"
    | "icon-md"
    | "icon-lg"
    | "icon-xl";
export type ButtonVariant = "default" | "filled" | "outline" | "ghost";

export type ButtonClassNames = {
    root?: string;
    container?: string;
    leftSection?: string;
    rightSection?: string;
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** The size of the button @default `md` */
    size?: ButtonSize;

    /** The radius of the button @default `md` */
    radius?: RefraktorRadius;

    /** The variant of the button @default `default` */
    variant?: ButtonVariant;

    /** Whether the button is disabled @default `false` */
    disabled?: boolean;

    /** Whether the button should take the full width of its container @default `false` */
    fullWidth?: boolean;

    /** The left section of the button */
    leftSection?: ReactNode;

    /** The right section of the button */
    rightSection?: ReactNode;

    /** Used for styling different parts of the component */
    classNames?: ButtonClassNames;

    /** Used for editing root class name */
    className?: string;
}

export interface ButtonFactoryPayload extends PolymorphicFactoryPayload {
    props: ButtonProps;
    defaultRef: HTMLButtonElement;
    defaultComponent: "button";
    compound: {
        configure: ReturnType<typeof createComponentConfig<ButtonProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<ButtonClassNames>>;
    };
}
