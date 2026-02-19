import { RefraktorSize } from "../../theme";

type TableSizeStyles = {
    headerCell: string;
    cell: string;
    caption: string;
};

type TableBodyStyleOptions = {
    striped: boolean;
    highlightOnHover: boolean;
    withRowBorders: boolean;
};

const sizes: Record<RefraktorSize, TableSizeStyles> = {
    xs: {
        headerCell: "px-2 py-1.5 text-xs",
        cell: "px-2 py-1.5 text-xs",
        caption: "text-xs"
    },
    sm: {
        headerCell: "px-2.5 py-2 text-xs",
        cell: "px-2.5 py-2 text-sm",
        caption: "text-xs"
    },
    md: {
        headerCell: "px-3 py-2.5 text-sm",
        cell: "px-3 py-2.5 text-sm",
        caption: "text-sm"
    },
    lg: {
        headerCell: "px-3.5 py-3 text-base",
        cell: "px-3.5 py-3 text-base",
        caption: "text-base"
    },
    xl: {
        headerCell: "px-4 py-3.5 text-lg",
        cell: "px-4 py-3.5 text-lg",
        caption: "text-lg"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];

export const getColumnBorder = (withColumnBorders = false) =>
    withColumnBorders
        ? "border-r border-[var(--refraktor-border)] last:border-r-0"
        : "";

export const getBodyStyles = ({
    striped,
    highlightOnHover,
    withRowBorders
}: TableBodyStyleOptions) =>
    [
        striped && "[&_tr:nth-child(odd)]:bg-[var(--refraktor-bg-subtle)]",
        highlightOnHover && "[&_tr:hover]:bg-[var(--refraktor-bg-hover)]",
        withRowBorders &&
            "[&_tr]:border-b [&_tr]:border-[var(--refraktor-border)] [&_tr:last-child]:border-b-0"
    ]
        .filter(Boolean)
        .join(" ");
