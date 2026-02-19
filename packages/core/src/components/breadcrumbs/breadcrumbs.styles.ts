import { RefraktorSize } from "../../theme";

type BreadcrumbsSizeStyles = {
    list: string;
    item: string;
    label: string;
    separator: string;
    collapse: string;
    iconSize: number;
};

const sizes: Record<RefraktorSize, BreadcrumbsSizeStyles> = {
    xs: {
        list: "gap-1",
        item: "gap-1",
        label: "text-xs",
        separator: "mx-1",
        collapse: "h-5 min-w-5 px-1 text-xs",
        iconSize: 12
    },
    sm: {
        list: "gap-1",
        item: "gap-1",
        label: "text-xs",
        separator: "mx-1",
        collapse: "h-6 min-w-6 px-1.5 text-xs",
        iconSize: 14
    },
    md: {
        list: "gap-1.5",
        item: "gap-1.5",
        label: "text-sm",
        separator: "mx-1.5",
        collapse: "h-7 min-w-7 px-2 text-sm",
        iconSize: 16
    },
    lg: {
        list: "gap-2",
        item: "gap-2",
        label: "text-base",
        separator: "mx-2",
        collapse: "h-8 min-w-8 px-2.5 text-base",
        iconSize: 18
    },
    xl: {
        list: "gap-2.5",
        item: "gap-2.5",
        label: "text-lg",
        separator: "mx-2.5",
        collapse: "h-9 min-w-9 px-3 text-lg",
        iconSize: 20
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
