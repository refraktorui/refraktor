import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTableContext } from "../table.context";
import { TableHeadFactoryPayload } from "../table.types";

const TableHead = factory<TableHeadFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { getStyles } = useTableContext();

        return (
            <thead
                ref={ref}
                className={cx(
                    "border-b border-[var(--refraktor-border)] bg-[var(--refraktor-bg-subtle)]",
                    getStyles("head"),
                    className
                )}
                {...props}
            >
                {children}
            </thead>
        );
    }
);

TableHead.displayName = "@refraktor/core/Table.Head";

export default TableHead;
