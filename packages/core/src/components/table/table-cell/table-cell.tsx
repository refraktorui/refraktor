import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTableContext } from "../table.context";
import { getColumnBorder, getSize } from "../table.styles";
import { TableCellFactoryPayload } from "../table.types";

const TableCell = factory<TableCellFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { size, withColumnBorders, getStyles } = useTableContext();
        const sizeStyles = getSize(size);

        return (
            <td
                ref={ref}
                className={cx(
                    "align-middle text-[var(--refraktor-text)]",
                    sizeStyles.cell,
                    getColumnBorder(withColumnBorders),
                    getStyles("cell"),
                    className
                )}
                {...props}
            >
                {children}
            </td>
        );
    }
);

TableCell.displayName = "@refraktor/core/Table.Cell";

export default TableCell;
