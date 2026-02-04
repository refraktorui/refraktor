import { ComponentPropsWithoutRef } from "react";
import type {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";

export type BadgeVariant = "default" | "outline";

export type BadgeClassNames = {
    root?: string;
    content?: string;
};

export interface BadgeProps extends ComponentPropsWithoutRef<"div"> {
    /** The variant of the badge @default `default` */
    variant?: BadgeVariant;

    /** The size of the badge @default `xs` */
    size?: RefraktorSize;

    /** The radius of the badge @default `md` */
    radius?: RefraktorRadius;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: BadgeClassNames;
}

export interface BadgeFactoryPayload extends FactoryPayload {
    props: BadgeProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<BadgeProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<BadgeClassNames>>;
    };
}
