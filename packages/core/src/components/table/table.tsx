import { useId } from "@refraktor/utils";
import { useCallback } from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { TableBody } from "./table-body";
import { TableCaption } from "./table-caption";
import { TableCell } from "./table-cell";
import { TableProvider } from "./table.context";
import { TableHead } from "./table-head";
import { TableHeaderCell } from "./table-header-cell";
import { TableRow } from "./table-row";
import { TableClassNames, TableFactoryPayload, TableProps } from "./table.types";

const defaultProps = {
    size: "md",
    radius: "default",
    striped: false,
    highlightOnHover: false,
    withRowBorders: true,
    withColumnBorders: false
} satisfies Partial<TableProps>;

const Table = factory<TableFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        children,
        size,
        radius,
        striped,
        highlightOnHover,
        withRowBorders,
        withColumnBorders,
        className,
        classNames,
        ...props
    } = useProps("Table", defaultProps, _props);
    const classes = useClassNames("Table", classNames);
    const _id = useId(id);

    const getStyles = useCallback(
        (part: keyof TableClassNames) => classes[part],
        [classes]
    );

    return (
        <TableProvider
            value={{
                size,
                radius,
                striped,
                highlightOnHover,
                withRowBorders,
                withColumnBorders,
                getStyles
            }}
        >
            <table
                ref={ref}
                id={_id}
                className={cx(
                    "w-full border-collapse text-left text-[var(--refraktor-text)]",
                    getRadius(radius),
                    classes.root,
                    className
                )}
                {...props}
            >
                {children}
            </table>
        </TableProvider>
    );
});

Table.displayName = "@refraktor/core/Table";
Table.configure = createComponentConfig<TableProps>();
Table.classNames = createClassNamesConfig<TableClassNames>();
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;
Table.Caption = TableCaption;

export default Table;
