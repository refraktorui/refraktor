import { createSafeContext } from "@refraktor/utils";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import { TableClassNames } from "./table.types";

export interface TableContextValue {
    size: RefraktorSize;
    radius: RefraktorRadius;
    striped: boolean;
    highlightOnHover: boolean;
    withRowBorders: boolean;
    withColumnBorders: boolean;
    getStyles: (part: keyof TableClassNames) => string | undefined;
}

export const [TableProvider, useTableContext] =
    createSafeContext<TableContextValue>(
        "Table component was not found in tree. Make sure Table subcomponents are wrapped with Table."
    );
