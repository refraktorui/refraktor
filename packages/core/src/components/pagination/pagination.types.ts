import { ComponentPropsWithoutRef } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";

export type PaginationVariant = "default" | "filled" | "outline" | "ghost";

export type PaginationAriaLabelType =
    | "page"
    | "first"
    | "previous"
    | "next"
    | "last";

export type PaginationClassNames = {
    root?: string;
    list?: string;
    item?: string;
    page?: string;
    control?: string;
    dots?: string;
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
};

export interface PaginationProps
    extends Omit<ComponentPropsWithoutRef<"nav">, "children" | "onChange"> {
    /** Total amount of pages */
    total: number;

    /** Active page (controlled) */
    value?: number;

    /** Initial active page (uncontrolled) */
    defaultValue?: number;

    /** Callback called when page changes */
    onChange?: (value: number) => void;

    /** Number of sibling pages around active page @default `1` */
    siblings?: number;

    /** Number of always-visible pages at the edges @default `1` */
    boundaries?: number;

    /** Whether to show previous/next controls @default `true` */
    withControls?: boolean;

    /** Whether to show first/last controls @default `false` */
    withEdges?: boolean;

    /** Hide component when total is 1 @default `false` */
    hideWithOnePage?: boolean;

    /** Whether all controls are disabled @default `false` */
    disabled?: boolean;

    /** The size of the pagination @default `md` */
    size?: RefraktorSize;

    /** The radius of page buttons @default `default` */
    radius?: RefraktorRadius;

    /** Visual style variant @default `default` */
    variant?: PaginationVariant;

    /** Used for custom aria labels */
    getItemAriaLabel?: (
        type: PaginationAriaLabelType,
        page: number,
        selected: boolean
    ) => string;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: PaginationClassNames;
}

export interface PaginationFactoryPayload extends FactoryPayload {
    props: PaginationProps;
    ref: HTMLElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<PaginationProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<PaginationClassNames>
        >;
    };
}
