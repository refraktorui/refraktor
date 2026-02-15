import { PickerSize } from "./picker.types";

export type PickerSizeStyles = {
    control: string;
    label: string;
    labelButton: string;
    cell: string;
    gridGap: string;
    iconSize: number;
};

const pickerSizes: Record<PickerSize, PickerSizeStyles> = {
    xs: {
        control: "size-6 text-xs",
        label: "text-xs",
        labelButton: "py-0.5 px-1",
        cell: "h-7 px-1 text-xs",
        gridGap: "gap-1",
        iconSize: 12
    },
    sm: {
        control: "size-7 text-xs",
        label: "text-xs",
        labelButton: "py-0.5 px-1",
        cell: "h-8 px-1.5 text-xs",
        gridGap: "gap-1",
        iconSize: 14
    },
    md: {
        control: "size-8 text-sm",
        label: "text-sm",
        labelButton: "py-1 px-1.5",
        cell: "h-9 px-2 text-sm",
        gridGap: "gap-1.5",
        iconSize: 16
    },
    lg: {
        control: "size-9 text-base",
        label: "text-base",
        labelButton: "py-1 px-2",
        cell: "h-10 px-2.5 text-base",
        gridGap: "gap-2",
        iconSize: 18
    },
    xl: {
        control: "size-10 text-lg",
        label: "text-lg",
        labelButton: "py-1.5 px-2.5",
        cell: "h-11 px-3 text-lg",
        gridGap: "gap-2",
        iconSize: 20
    }
};

const gridColumns: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6"
};

export const getPickerSizeStyles = (size: PickerSize = "md") =>
    pickerSizes[size] ?? pickerSizes.md;

export const getGridColumns = (columns: number) =>
    gridColumns[columns] ?? gridColumns[4];
