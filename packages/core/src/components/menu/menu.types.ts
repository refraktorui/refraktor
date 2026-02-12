import { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
    FlipOptions,
    InlineOptions,
    Placement,
    ShiftOptions
} from "@floating-ui/react";
import { TransitionProps } from "../transition";
import { RefraktorRadius } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { MenuTrigger } from "./menu-trigger";
import { MenuDropdown } from "./menu-dropdown";
import { MenuItem } from "./menu-item";
import { MenuLabel } from "./menu-label";
import { MenuSeparator } from "./menu-separator";
import { MenuSub } from "./menu-sub";
import { MenuSubTrigger } from "./menu-sub-trigger";
import { MenuSubDropdown } from "./menu-sub-dropdown";

export type MenuClassNames = {
    root?: string;
    trigger?: string;
    dropdown?: string;
    item?: string;
    label?: string;
    separator?: string;
    subTrigger?: string;
    subDropdown?: string;
    itemLeftSection?: string;
    itemRightSection?: string;
    subIndicator?: string;
};

export type MenuPositioning = {
    /** The placement of the menu relative to the trigger element @default `bottom-start` */
    placement?: Placement;

    /** Offset distance from the trigger element in pixels @default `4` */
    offset?: number;
};

export type MenuMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export type MenuTriggerType = "click" | "hover" | "focus";

export interface MenuProps extends ComponentPropsWithoutRef<"div"> {
    /** Children containing subcomponents */
    children: ReactNode;

    /** State of the menu (controlled) */
    opened?: boolean;

    /** Initial state of the menu (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when the menu state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Positioning settings for the menu */
    positioning?: MenuPositioning;

    /** Middlewares settings for the menu */
    middlewares?: MenuMiddlewares;

    /** Whether the menu is disabled @default `false` */
    disabled?: boolean;

    /** Trigger type for the menu @default `click` */
    trigger?: MenuTriggerType;

    /** Delay in milliseconds before the menu opens @default `0` */
    openDelay?: number;

    /** Delay in milliseconds before the menu closes @default `100` */
    closeDelay?: number;

    /** Transition props for the menu dropdown, uses Transition component internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Radius for menu dropdowns @default `default` */
    radius?: RefraktorRadius;

    /** Whether to render dropdowns within a portal @default `true` */
    withinPortal?: boolean;

    /** Whether to close on click outside @default `true` */
    closeOnClickOutside?: boolean;

    /** Whether to close on escape key @default `true` */
    closeOnEscape?: boolean;

    /** Whether to close the whole menu tree after selecting an item @default `true` */
    closeOnItemClick?: boolean;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: MenuClassNames;
}

export interface MenuTriggerProps extends ComponentPropsWithoutRef<"div"> {
    /** The trigger element */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuDropdownProps extends ComponentPropsWithoutRef<"div"> {
    /** Content to display inside the dropdown */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuItemProps
    extends Omit<ComponentPropsWithoutRef<"button">, "onSelect"> {
    /** Content of the item */
    children: ReactNode;

    /** Callback called when an item is selected */
    onSelect?: () => void;

    /** Whether the item is disabled @default `false` */
    disabled?: boolean;

    /** Whether this item should close menus when selected, defaults to Menu closeOnItemClick */
    closeOnSelect?: boolean;

    /** Optional typeahead value if children is non-text */
    textValue?: string;

    /** Optional left section for icons or markers */
    leftSection?: ReactNode;

    /** Optional right section for hints or shortcuts */
    rightSection?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuLabelProps extends ComponentPropsWithoutRef<"div"> {
    /** Label content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuSeparatorProps extends ComponentPropsWithoutRef<"div"> {
    /** Used for editing root class name */
    className?: string;
}

export interface MenuSubProps extends ComponentPropsWithoutRef<"div"> {
    /** Children containing submenu trigger and submenu dropdown */
    children: ReactNode;

    /** State of the submenu (controlled) */
    opened?: boolean;

    /** Initial state of the submenu (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when the submenu state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Positioning settings for the submenu */
    positioning?: MenuPositioning;

    /** Middlewares settings for the submenu */
    middlewares?: MenuMiddlewares;

    /** Whether the submenu is disabled @default `false` */
    disabled?: boolean;

    /** Trigger type for the submenu @default `hover` */
    trigger?: MenuTriggerType;

    /** Delay in milliseconds before the submenu opens @default `75` */
    openDelay?: number;

    /** Delay in milliseconds before the submenu closes @default `125` */
    closeDelay?: number;

    /** Whether to close submenu on click outside @default `false` */
    closeOnClickOutside?: boolean;

    /** Whether to close submenu on escape @default `true` */
    closeOnEscape?: boolean;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuSubTriggerProps
    extends Omit<ComponentPropsWithoutRef<"button">, "onSelect"> {
    /** Content of the submenu trigger */
    children: ReactNode;

    /** Optional typeahead value if children is non-text */
    textValue?: string;

    /** Whether the submenu trigger is disabled @default `false` */
    disabled?: boolean;

    /** Optional left section for icons or markers */
    leftSection?: ReactNode;

    /** Optional right section for hints or shortcuts */
    rightSection?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuSubDropdownProps extends ComponentPropsWithoutRef<"div"> {
    /** Content to display inside the submenu dropdown */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface MenuFactoryPayload extends FactoryPayload {
    props: MenuProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<MenuProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<MenuClassNames>>;
        Trigger: typeof MenuTrigger;
        Dropdown: typeof MenuDropdown;
        Item: typeof MenuItem;
        Label: typeof MenuLabel;
        Separator: typeof MenuSeparator;
        Sub: typeof MenuSub;
        SubTrigger: typeof MenuSubTrigger;
        SubDropdown: typeof MenuSubDropdown;
    };
}

export interface MenuTriggerFactoryPayload extends FactoryPayload {
    props: MenuTriggerProps;
    ref: HTMLDivElement;
}

export interface MenuDropdownFactoryPayload extends FactoryPayload {
    props: MenuDropdownProps;
    ref: HTMLDivElement;
}

export interface MenuItemFactoryPayload extends FactoryPayload {
    props: MenuItemProps;
    ref: HTMLButtonElement;
}

export interface MenuLabelFactoryPayload extends FactoryPayload {
    props: MenuLabelProps;
    ref: HTMLDivElement;
}

export interface MenuSeparatorFactoryPayload extends FactoryPayload {
    props: MenuSeparatorProps;
    ref: HTMLDivElement;
}

export interface MenuSubFactoryPayload extends FactoryPayload {
    props: MenuSubProps;
    ref: HTMLDivElement;
}

export interface MenuSubTriggerFactoryPayload extends FactoryPayload {
    props: MenuSubTriggerProps;
    ref: HTMLButtonElement;
}

export interface MenuSubDropdownFactoryPayload extends FactoryPayload {
    props: MenuSubDropdownProps;
    ref: HTMLDivElement;
}
