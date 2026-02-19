import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTableContext } from "../table.context";
import { getBodyStyles } from "../table.styles";
import { TableBodyFactoryPayload } from "../table.types";

const TableBody = factory<TableBodyFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const {
            striped,
            highlightOnHover,
            withRowBorders,
            getStyles
        } = useTableContext();

        const bodyStyles = getBodyStyles({
            striped,
            highlightOnHover,
            withRowBorders
        });

        return (
            <tbody
                ref={ref}
                className={cx("align-top", bodyStyles, getStyles("body"), className)}
                {...props}
            >
                {children}
            </tbody>
        );
    }
);

TableBody.displayName = "@refraktor/core/Table.Body";

export default TableBody;
