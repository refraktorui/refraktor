import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type SwitchLabelPosition = "left" | "right";

export type SwitchClassNames = {
    root?: string;
    input?: string;
    track?: string;
    thumb?: string;
    label?: string;
};

export interface SwitchProps
    extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
    /** State of the switch (controlled) */
    checked?: boolean;

    /** Initial state of the switch (uncontrolled) */
    defaultChecked?: boolean;

    /** Callback called when the switch state changes */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /** The size of the switch @default `md` */
    size?: RefraktorSize;

    /** The radius of the switch @default `full` */
    radius?: RefraktorRadius;

    /** The label of the switch */
    label?: ReactNode;

    /** The position of the label @default `right` */
    labelPosition?: SwitchLabelPosition;

    /** Error state or message */
    error?: ReactNode;

    /** Description below the switch */
    description?: ReactNode;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: SwitchClassNames;
}

export interface SwitchFactoryPayload extends FactoryPayload {
    props: SwitchProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<SwitchProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<SwitchClassNames>>;
    };
}
