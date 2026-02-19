import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type BreadcrumbsItem = {
    label: ReactNode;
    href?: string;
    target?: ComponentPropsWithoutRef<"a">["target"];
    rel?: ComponentPropsWithoutRef<"a">["rel"];
    ariaLabel?: string;
};

export type BreadcrumbsClassNames = {
    root?: string;
    list?: string;
    item?: string;
    link?: string;
    current?: string;
    separator?: string;
    collapse?: string;
};

export interface BreadcrumbsProps
    extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
    /** Breadcrumb items in hierarchical order */
    items: BreadcrumbsItem[];

    /** Collapse items when amount exceeds this number. Use `0` to disable @default `4` */
    maxItems?: number;

    /** Amount of visible items before collapsed section @default `1` */
    itemsBeforeCollapse?: number;

    /** Amount of visible items after collapsed section @default `1` */
    itemsAfterCollapse?: number;

    /** Collapse state (controlled) */
    expanded?: boolean;

    /** Initial collapse state (uncontrolled) @default `false` */
    defaultExpanded?: boolean;

    /** Callback called when collapse state changes */
    onExpandedChange?: (expanded: boolean) => void;

    /** Accessible label for collapse control @default `Show full breadcrumb path` */
    expandLabel?: string;

    /** Separator between items */
    separator?: ReactNode;

    /** Size of breadcrumb text and controls @default `md` */
    size?: RefraktorSize;

    /** Radius of collapse control @default `default` */
    radius?: RefraktorRadius;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: BreadcrumbsClassNames;
}

export interface BreadcrumbsFactoryPayload extends FactoryPayload {
    props: BreadcrumbsProps;
    ref: HTMLElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<BreadcrumbsProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<BreadcrumbsClassNames>
        >;
    };
}
