import { RefraktorSize } from "../../theme";

const sizes: Record<RefraktorSize, Record<string, string>> = {
    xs: {
        track: "w-7 h-3.5",
        thumb: "w-2.5 h-2.5 group-data-[checked=true]:translate-x-3.5",
        label: "text-[10px]"
    },
    sm: {
        track: "w-8.5 h-4",
        thumb: "w-3 h-3 group-data-[checked=true]:translate-x-4.5",
        label: "text-xs"
    },
    md: {
        track: "w-10 h-[1.125rem]",
        thumb: "w-3.5 h-3.5 group-data-[checked=true]:translate-x-5.5",
        label: "text-sm"
    },
    lg: {
        track: "w-12 h-6",
        thumb: "w-[1.125rem] h-[1.125rem] group-data-[checked=true]:translate-x-6.5",
        label: "text-base"
    },
    xl: {
        track: "w-14 h-7",
        thumb: "w-5 h-5 group-data-[checked=true]:translate-x-7.5",
        label: "text-lg"
    }
};

export const getSize = (size: RefraktorSize = "md") => sizes[size];
