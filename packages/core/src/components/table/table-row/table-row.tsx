import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTableContext } from "../table.context";
import { TableRowFactoryPayload } from "../table.types";

const TableRow = factory<TableRowFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { highlightOnHover, getStyles } = useTableContext();

        return (
            <tr
                ref={ref}
                className={cx(
                    "align-middle",
                    highlightOnHover && "transition-colors",
                    getStyles("row"),
                    className
                )}
                {...props}
            >
                {children}
            </tr>
        );
    }
);

TableRow.displayName = "@refraktor/core/Table.Row";

export default TableRow;
