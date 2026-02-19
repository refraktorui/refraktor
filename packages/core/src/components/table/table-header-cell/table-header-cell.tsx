import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTableContext } from "../table.context";
import { getColumnBorder, getSize } from "../table.styles";
import { TableHeaderCellFactoryPayload } from "../table.types";

const TableHeaderCell = factory<TableHeaderCellFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { size, withColumnBorders, getStyles } = useTableContext();
        const sizeStyles = getSize(size);

        return (
            <th
                ref={ref}
                className={cx(
                    "text-left font-medium align-middle text-[var(--refraktor-text-secondary)]",
                    sizeStyles.headerCell,
                    getColumnBorder(withColumnBorders),
                    getStyles("headerCell"),
                    className
                )}
                {...props}
            >
                {children}
            </th>
        );
    }
);

TableHeaderCell.displayName = "@refraktor/core/Table.HeaderCell";

export default TableHeaderCell;
