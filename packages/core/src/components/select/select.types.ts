import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
    FlipOptions,
    InlineOptions,
    Placement,
    ShiftOptions
} from "@floating-ui/react";
import type { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import type { TransitionProps } from "../transition";
import type { InputVariant } from "../input";
import type { SelectRoot } from "./select-root";
import type { SelectTrigger } from "./select-trigger";
import type { SelectDropdown } from "./select-dropdown";
import type { SelectGroup } from "./select-group";
import type { SelectItem } from "./select-item";

export type SelectClassNames = {
    root?: string;
    trigger?: string;
    triggerInput?: string;
    triggerIcon?: string;
    dropdown?: string;
    search?: string;
    searchInput?: string;
    options?: string;
    group?: string;
    groupLabel?: string;
    item?: string;
    itemLabel?: string;
    itemCheck?: string;
    empty?: string;
};

export type SelectPositioning = {
    /** The placement of the dropdown relative to the trigger @default `bottom-start` */
    placement?: Placement;

    /** Offset distance from the trigger in pixels @default `4` */
    offset?: number;
};

export type SelectMiddlewares = {
    shift?: boolean | ShiftOptions;
    flip?: boolean | FlipOptions;
    inline?: boolean | InlineOptions;
};

export interface SelectItemData {
    /** Option value */
    value: string;

    /** Option label */
    label: ReactNode;

    /** Optional searchable text for non-string labels */
    textValue?: string;

    /** Whether the option is disabled */
    disabled?: boolean;
}

export interface SelectGroupData {
    /** Group label */
    label?: ReactNode;

    /** Group items */
    items: SelectItemData[];
}

export type SelectData = SelectItemData | SelectGroupData;

export interface SelectRootProps
    extends Omit<
        ComponentPropsWithoutRef<"div">,
        "value" | "defaultValue" | "onChange"
    > {
    /** Children containing select subcomponents */
    children: ReactNode;

    /** Label text */
    label?: ReactNode;

    /** Description text */
    description?: ReactNode;

    /** Error message */
    error?: ReactNode;

    /** Whether the field is required */
    required?: boolean;

    /** Display an asterisk next to the label */
    withAsterisk?: boolean;

    /** Selected value (controlled) */
    value?: string | null;

    /** Initial selected value (uncontrolled) */
    defaultValue?: string | null;

    /** Callback called when selected value changes */
    onChange?: (value: string | null) => void;

    /** Dropdown open state (controlled) */
    opened?: boolean;

    /** Initial dropdown open state (uncontrolled) */
    defaultOpened?: boolean;

    /** Callback called when dropdown open state changes */
    onOpenedChange?: (opened: boolean) => void;

    /** Positioning settings */
    positioning?: SelectPositioning;

    /** Floating middleware settings */
    middlewares?: SelectMiddlewares;

    /** Whether select is disabled @default `false` */
    disabled?: boolean;

    /** Whether to render searchable input inside dropdown @default `false` */
    searchable?: boolean;

    /** Search query (controlled) */
    searchValue?: string;

    /** Initial search query (uncontrolled) */
    defaultSearchValue?: string;

    /** Callback called when search query changes */
    onSearchChange?: (value: string) => void;

    /** Trigger placeholder text @default `Select option` */
    placeholder?: string;

    /** Search input placeholder @default `Search...` */
    searchPlaceholder?: string;

    /** Content rendered when no options match @default `No options` */
    nothingFound?: ReactNode;

    /** Trigger and search input size @default `md` */
    size?: RefraktorSize;

    /** Trigger and search input radius @default `default` */
    radius?: RefraktorRadius;

    /** Trigger and search input variant @default `default` */
    variant?: InputVariant;

    /** Whether to render dropdown in portal @default `true` */
    withinPortal?: boolean;

    /** Whether to close on click outside @default `true` */
    closeOnClickOutside?: boolean;

    /** Whether to close on Escape key @default `true` */
    closeOnEscape?: boolean;

    /** Transition props for dropdown, uses Transition internally */
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: SelectClassNames;
}

export interface SelectTriggerProps extends ComponentPropsWithoutRef<"div"> {
    /** Trigger placeholder override */
    placeholder?: string;

    /** Optional custom right section */
    rightSection?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface SelectDropdownProps extends ComponentPropsWithoutRef<"div"> {
    /** Content displayed inside dropdown */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface SelectGroupProps extends ComponentPropsWithoutRef<"div"> {
    /** Group label */
    label?: ReactNode;

    /** Group content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface SelectItemProps
    extends Omit<ComponentPropsWithoutRef<"button">, "value" | "onSelect"> {
    /** Option value */
    value: string;

    /** Option content */
    children: ReactNode;

    /** Callback called when option is selected */
    onSelect?: (value: string) => void;

    /** Optional searchable text for non-string children */
    textValue?: string;

    /** Whether option is disabled */
    disabled?: boolean;

    /** Used for editing root class name */
    className?: string;
}

export interface SelectProps extends Omit<SelectRootProps, "children"> {
    /** Compound children. If provided, data-based rendering is skipped */
    children?: ReactNode;

    /** Data used for built-in rendering mode */
    data?: SelectData[];
}

export interface SelectFactoryPayload extends FactoryPayload {
    props: SelectProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<SelectProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<SelectClassNames>>;
        Root: typeof SelectRoot;
        Trigger: typeof SelectTrigger;
        Dropdown: typeof SelectDropdown;
        Group: typeof SelectGroup;
        Item: typeof SelectItem;
    };
}

export interface SelectRootFactoryPayload extends FactoryPayload {
    props: SelectRootProps;
    ref: HTMLDivElement;
}

export interface SelectTriggerFactoryPayload extends FactoryPayload {
    props: SelectTriggerProps;
    ref: HTMLDivElement;
}

export interface SelectDropdownFactoryPayload extends FactoryPayload {
    props: SelectDropdownProps;
    ref: HTMLDivElement;
}

export interface SelectGroupFactoryPayload extends FactoryPayload {
    props: SelectGroupProps;
    ref: HTMLDivElement;
}

export interface SelectItemFactoryPayload extends FactoryPayload {
    props: SelectItemProps;
    ref: HTMLButtonElement;
}
