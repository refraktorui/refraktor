import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { ChipGroup } from "./chip-group";

export type ChipVariant = "default" | "outline";
export type ChipGroupOrientation = "horizontal" | "vertical";

export type ChipClassNames = {
    root?: string;
    leftSection?: string;
    label?: string;
    rightSection?: string;
    removeButton?: string;
    removeIcon?: string;
};

export type ChipGroupClassNames = {
    root?: string;
};

export interface ChipProps extends ComponentPropsWithoutRef<"div"> {
    /** The value used by Chip.Group */
    value?: string;

    /** The selected state of the chip (controlled) */
    selected?: boolean;

    /** The initial selected state of the chip (uncontrolled) */
    defaultSelected?: boolean;

    /** Callback called when selected state changes */
    onSelectedChange?: (selected: boolean) => void;

    /** Whether chip can be toggled @default `false` */
    selectable?: boolean;

    /** Whether to show remove button @default `false` */
    removable?: boolean;

    /** Callback called when remove button is clicked */
    onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    /** Accessible label for remove button */
    removeButtonLabel?: string;

    /** Content rendered at the start of the chip */
    leftSection?: ReactNode;

    /** Content rendered before remove button at the end of the chip */
    rightSection?: ReactNode;

    /** The size of the chip @default `sm` */
    size?: RefraktorSize;

    /** The radius of the chip @default `full` */
    radius?: RefraktorRadius;

    /** The variant of the chip @default `default` */
    variant?: ChipVariant;

    /** Whether chip is disabled @default `false` */
    disabled?: boolean;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ChipClassNames;
}

export interface ChipGroupProps
    extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
    /** Chip components to render */
    children: ReactNode;

    /** Selected values (controlled) */
    value?: string[];

    /** Initial selected values (uncontrolled) */
    defaultValue?: string[];

    /** Callback called when values change */
    onChange?: (value: string[]) => void;

    /** Hidden input name used for form submission */
    name?: string;

    /** Whether all chips in group are disabled */
    disabled?: boolean;

    /** Shared chip size */
    size?: RefraktorSize;

    /** Shared chip radius */
    radius?: RefraktorRadius;

    /** Shared chip variant */
    variant?: ChipVariant;

    /** Layout direction @default `horizontal` */
    orientation?: ChipGroupOrientation;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: ChipGroupClassNames;
}

export interface ChipFactoryPayload extends FactoryPayload {
    props: ChipProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ChipProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<ChipClassNames>>;
        Group: typeof ChipGroup;
    };
}

export interface ChipGroupFactoryPayload extends FactoryPayload {
    props: ChipGroupProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<ChipGroupProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<ChipGroupClassNames>
        >;
    };
}
