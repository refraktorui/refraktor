import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { TableBody } from "./table-body";
import { TableCaption } from "./table-caption";
import { TableCell } from "./table-cell";
import { TableHead } from "./table-head";
import { TableHeaderCell } from "./table-header-cell";
import { TableRow } from "./table-row";

export type TableClassNames = {
    root?: string;
    head?: string;
    body?: string;
    row?: string;
    headerCell?: string;
    cell?: string;
    caption?: string;
};

export interface TableProps extends ComponentPropsWithoutRef<"table"> {
    /** Children containing table subcomponents */
    children: ReactNode;

    /** Shared table size @default `md` */
    size?: RefraktorSize;

    /** Shared table radius @default `default` */
    radius?: RefraktorRadius;

    /** Whether odd body rows are striped @default `false` */
    striped?: boolean;

    /** Whether body rows highlight on hover @default `false` */
    highlightOnHover?: boolean;

    /** Whether body rows have bottom border @default `true` */
    withRowBorders?: boolean;

    /** Whether cells have vertical separators @default `false` */
    withColumnBorders?: boolean;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: TableClassNames;
}

export interface TableHeadProps extends ComponentPropsWithoutRef<"thead"> {
    /** Header content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TableBodyProps extends ComponentPropsWithoutRef<"tbody"> {
    /** Body content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TableRowProps extends ComponentPropsWithoutRef<"tr"> {
    /** Row content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TableHeaderCellProps extends ComponentPropsWithoutRef<"th"> {
    /** Header cell content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TableCellProps extends ComponentPropsWithoutRef<"td"> {
    /** Cell content */
    children: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TableCaptionProps extends ComponentPropsWithoutRef<"caption"> {
    /** Caption content */
    children?: ReactNode;

    /** Used for editing root class name */
    className?: string;
}

export interface TableFactoryPayload extends FactoryPayload {
    props: TableProps;
    ref: HTMLTableElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<TableProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<TableClassNames>>;
        Head: typeof TableHead;
        Body: typeof TableBody;
        Row: typeof TableRow;
        HeaderCell: typeof TableHeaderCell;
        Cell: typeof TableCell;
        Caption: typeof TableCaption;
    };
}

export interface TableHeadFactoryPayload extends FactoryPayload {
    props: TableHeadProps;
    ref: HTMLTableSectionElement;
}

export interface TableBodyFactoryPayload extends FactoryPayload {
    props: TableBodyProps;
    ref: HTMLTableSectionElement;
}

export interface TableRowFactoryPayload extends FactoryPayload {
    props: TableRowProps;
    ref: HTMLTableRowElement;
}

export interface TableHeaderCellFactoryPayload extends FactoryPayload {
    props: TableHeaderCellProps;
    ref: HTMLTableCellElement;
}

export interface TableCellFactoryPayload extends FactoryPayload {
    props: TableCellProps;
    ref: HTMLTableCellElement;
}

export interface TableCaptionFactoryPayload extends FactoryPayload {
    props: TableCaptionProps;
    ref: HTMLTableCaptionElement;
}
