import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { RadioGroup } from "./radio-group";

export type RadioLabelPosition = "left" | "right";
export type RadioGroupOrientation = "vertical" | "horizontal";

export type RadioClassNames = {
    root?: string;
    body?: string;
    input?: string;
    indicator?: string;
    dot?: string;
    label?: string;
    description?: string;
    error?: string;
};

export type RadioGroupClassNames = {
    root?: string;
};

export interface RadioProps extends Omit<
    ComponentPropsWithoutRef<"input">,
    "size" | "onChange"
> {
    /** State of the radio (controlled) */
    checked?: boolean;

    /** Initial state of the radio (uncontrolled) */
    defaultChecked?: boolean;

    /** Callback called when the radio state changes */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /** Value used in Radio.Group */
    value?: string;

    /** The size of the radio @default `md` */
    size?: RefraktorSize;

    /** The radius of the radio @default `full` */
    radius?: RefraktorRadius;

    /** The label of the radio */
    label?: ReactNode;

    /** The position of the label @default `right` */
    labelPosition?: RadioLabelPosition;

    /** Error state or message */
    error?: ReactNode;

    /** Description below the radio */
    description?: ReactNode;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: RadioClassNames;
}

export interface RadioGroupProps extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange"
> {
    /** Radio items to render */
    children: ReactNode;

    /** Selected value (controlled) */
    value?: string;

    /** Initial selected value (uncontrolled) */
    defaultValue?: string;

    /** Callback called when group value changes */
    onChange?: (value: string) => void;

    /** Name propagated to radio inputs in the group */
    name?: string;

    /** Whether all radios in group are disabled */
    disabled?: boolean;

    /** Shared radio size */
    size?: RefraktorSize;

    /** Shared radio radius */
    radius?: RefraktorRadius;

    /** Layout direction @default `vertical` */
    orientation?: RadioGroupOrientation;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: RadioGroupClassNames;
}

export interface RadioFactoryPayload extends FactoryPayload {
    props: RadioProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<RadioProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<RadioClassNames>>;
        Group: typeof RadioGroup;
    };
}

export interface RadioGroupFactoryPayload extends FactoryPayload {
    props: RadioGroupProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<RadioGroupProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<RadioGroupClassNames>
        >;
    };
}
