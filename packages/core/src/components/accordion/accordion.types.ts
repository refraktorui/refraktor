import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { AccordionControl } from "./accordion-control";
import { AccordionItem } from "./accordion-item";
import { AccordionPanel } from "./accordion-panel";

export type AccordionValue = string | null | string[];
export type AccordionVariant = "default" | "separated";

export type AccordionClassNames = {
    root?: string;
    item?: string;
    control?: string;
    chevron?: string;
    panel?: string;
};

export interface AccordionProps
    extends Omit<
        ComponentPropsWithoutRef<"div">,
        "onChange" | "value" | "defaultValue"
    > {
    /** Children containing accordion subcomponents */
    children: ReactNode;

    /** Opened value(s) (controlled) */
    value?: AccordionValue;

    /** Initial opened value(s) (uncontrolled) */
    defaultValue?: AccordionValue;

    /** Callback called when opened value(s) change */
    onChange?: (value: AccordionValue) => void;

    /** Allow multiple opened items @default `false` */
    multiple?: boolean;

    /** Allow closing opened item in single mode @default `true` */
    collapsible?: boolean;

    /** Keep closed panels mounted @default `false` */
    keepMounted?: boolean;

    /** Size of control/panel spacing @default `md` */
    size?: RefraktorSize;

    /** Radius applied to separated items @default `default` */
    radius?: RefraktorRadius;

    /** Visual variant @default `default` */
    variant?: AccordionVariant;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: AccordionClassNames;
}

export interface AccordionItemProps extends ComponentPropsWithoutRef<"div"> {
    /** Unique item value */
    value: string;

    /** Item content (Control + Panel) */
    children: ReactNode;

    /** Whether item is disabled @default `false` */
    disabled?: boolean;

    /** Used for editing root class name */
    className?: string;
}

export interface AccordionControlProps
    extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
    /** Trigger label/content */
    children: ReactNode;

    /** Optional chevron content */
    chevron?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface AccordionPanelProps extends ComponentPropsWithoutRef<"div"> {
    /** Panel content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface AccordionFactoryPayload extends FactoryPayload {
    props: AccordionProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<AccordionProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<AccordionClassNames>
        >;
        Item: typeof AccordionItem;
        Control: typeof AccordionControl;
        Panel: typeof AccordionPanel;
    };
}

export interface AccordionItemFactoryPayload extends FactoryPayload {
    props: AccordionItemProps;
    ref: HTMLDivElement;
}

export interface AccordionControlFactoryPayload extends FactoryPayload {
    props: AccordionControlProps;
    ref: HTMLButtonElement;
}

export interface AccordionPanelFactoryPayload extends FactoryPayload {
    props: AccordionPanelProps;
    ref: HTMLDivElement;
}
