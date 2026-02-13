import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { TabsList } from "./tabs-list";
import { TabsPanel } from "./tabs-panel";
import { TabsTab } from "./tabs-tab";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";
export type TabsVariant = "pills" | "underline";

export type TabsClassNames = {
    root?: string;
    list?: string;
    tab?: string;
    panel?: string;
};

export interface TabsProps extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange"
> {
    /** Children containing subcomponents */
    children: ReactNode;

    /** Active tab value (controlled) */
    value?: string;

    /** Initial active tab value (uncontrolled) */
    defaultValue?: string;

    /** Callback called when active tab changes */
    onChange?: (value: string) => void;

    /** Tabs orientation @default `horizontal` */
    orientation?: TabsOrientation;

    /** Keyboard activation mode @default `automatic` */
    activationMode?: TabsActivationMode;

    /** Whether keyboard navigation should wrap around @default `true` */
    loop?: boolean;

    /** Keep all panels mounted and toggle hidden state @default `false` */
    keepMounted?: boolean;

    /** The size of tabs @default `md` */
    size?: RefraktorSize;

    /** The radius used for list and tabs @default `default` */
    radius?: RefraktorRadius;

    /** Visual style variant @default `underline` */
    variant?: TabsVariant;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: TabsClassNames;
}

export interface TabsListProps extends ComponentPropsWithoutRef<"div"> {
    /** The tab list content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TabsTabProps extends Omit<
    ComponentPropsWithoutRef<"button">,
    "value"
> {
    /** The tab value used to link with panel */
    value: string;

    /** Whether the tab is disabled @default `false` */
    disabled?: boolean;

    /** The tab label */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TabsPanelProps extends ComponentPropsWithoutRef<"div"> {
    /** Panel value used to match tab */
    value: string;

    /** Panel content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TabsFactoryPayload extends FactoryPayload {
    props: TabsProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TabsProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TabsClassNames>>;
        List: typeof TabsList;
        Tab: typeof TabsTab;
        Panel: typeof TabsPanel;
    };
}

export interface TabsListFactoryPayload extends FactoryPayload {
    props: TabsListProps;
    ref: HTMLDivElement;
}

export interface TabsTabFactoryPayload extends FactoryPayload {
    props: TabsTabProps;
    ref: HTMLButtonElement;
}

export interface TabsPanelFactoryPayload extends FactoryPayload {
    props: TabsPanelProps;
    ref: HTMLDivElement;
}
