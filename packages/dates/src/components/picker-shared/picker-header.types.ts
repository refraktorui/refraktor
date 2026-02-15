import {
    ComponentPropsWithoutRef,
    MouseEventHandler,
    ReactNode
} from "react";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "@refraktor/core";
import { PickerRadius, PickerSize } from "./picker.types";

export type PickerHeaderClassNames = {
    root?: string;
    controls?: string;
    control?: string;
    previousControl?: string;
    nextControl?: string;
    label?: string;
    labelButton?: string;
    labelText?: string;
};

export interface PickerHeaderProps
    extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    label: ReactNode;
    onPrevious?: () => void;
    onNext?: () => void;
    onLabelClick?: MouseEventHandler<HTMLButtonElement>;
    previousDisabled?: boolean;
    nextDisabled?: boolean;
    previousLabel?: string;
    nextLabel?: string;
    size?: PickerSize;
    radius?: PickerRadius;
    className?: string;
    classNames?: PickerHeaderClassNames;
}

export interface PickerHeaderFactoryPayload extends FactoryPayload {
    props: PickerHeaderProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PickerHeaderProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<PickerHeaderClassNames>
        >;
    };
}
