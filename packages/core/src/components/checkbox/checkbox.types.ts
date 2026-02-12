import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { CheckboxGroup } from "./checkbox-group";

export type CheckboxLabelPosition = "left" | "right";
export type CheckboxGroupOrientation = "vertical" | "horizontal";

export type CheckboxClassNames = {
    root?: string;
    body?: string;
    input?: string;
    indicator?: string;
    icon?: string;
    label?: string;
    description?: string;
    error?: string;
};

export type CheckboxGroupClassNames = {
    root?: string;
};

export interface CheckboxProps
    extends Omit<ComponentPropsWithoutRef<"input">, "size" | "onChange"> {
    /** State of the checkbox (controlled) */
    checked?: boolean;

    /** Initial state of the checkbox (uncontrolled) */
    defaultChecked?: boolean;

    /** Callback called when the checkbox state changes */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /** Whether the checkbox should display indeterminate state */
    indeterminate?: boolean;

    /** Value used in Checkbox.Group */
    value?: string;

    /** The size of the checkbox @default `md` */
    size?: RefraktorSize;

    /** The radius of the checkbox @default `sm` */
    radius?: RefraktorRadius;

    /** The label of the checkbox */
    label?: ReactNode;

    /** The position of the label @default `right` */
    labelPosition?: CheckboxLabelPosition;

    /** Error state or message */
    error?: ReactNode;

    /** Description below the checkbox */
    description?: ReactNode;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: CheckboxClassNames;
}

export interface CheckboxGroupProps
    extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
    /** Checkbox items to render */
    children: ReactNode;

    /** Selected values (controlled) */
    value?: string[];

    /** Initial selected values (uncontrolled) */
    defaultValue?: string[];

    /** Callback called when group values change */
    onChange?: (value: string[]) => void;

    /** Name propagated to checkbox inputs in the group */
    name?: string;

    /** Whether all checkboxes in group are disabled */
    disabled?: boolean;

    /** Shared checkbox size */
    size?: RefraktorSize;

    /** Shared checkbox radius */
    radius?: RefraktorRadius;

    /** Layout direction @default `vertical` */
    orientation?: CheckboxGroupOrientation;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: CheckboxGroupClassNames;
}

export interface CheckboxFactoryPayload extends FactoryPayload {
    props: CheckboxProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<CheckboxProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<CheckboxClassNames>>;
        Group: typeof CheckboxGroup;
    };
}

export interface CheckboxGroupFactoryPayload extends FactoryPayload {
    props: CheckboxGroupProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<CheckboxGroupProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<CheckboxGroupClassNames>
        >;
    };
}
