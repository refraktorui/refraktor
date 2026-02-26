import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export interface SegmentedControlItem {
    /** Item value */
    value: string;

    /** Item label */
    label: ReactNode;

    /** Optional item icon */
    icon?: ReactNode;

    /** Whether item is disabled */
    disabled?: boolean;
}

export type SegmentedControlClassNames = {
    root?: string;
    control?: string;
    label?: string;
};

export interface SegmentedControlProps extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange"
> {
    /** Items to render */
    data: SegmentedControlItem[];

    /** Selected value (controlled) */
    value?: string;

    /** Initial selected value (uncontrolled) */
    defaultValue?: string;

    /** Callback called when selected value changes */
    onChange?: (value: string) => void;

    /** The size of segmented control @default `md` */
    size?: RefraktorSize;

    /** The radius of segmented control @default `default` */
    radius?: RefraktorRadius;

    /** Whether segmented control should take full width @default `false` */
    fullWidth?: boolean;

    /** Whether segmented control is disabled @default `false` */
    disabled?: boolean;

    /** Hidden input name for forms */
    name?: string;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: SegmentedControlClassNames;
}

export interface SegmentedControlFactoryPayload extends FactoryPayload {
    props: SegmentedControlProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<
            typeof createComponentConfig<SegmentedControlProps>
        >;
        classNames: ReturnType<
            typeof createClassNamesConfig<SegmentedControlClassNames>
        >;
    };
}
