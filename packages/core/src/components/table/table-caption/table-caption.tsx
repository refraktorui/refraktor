import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTableContext } from "../table.context";
import { getSize } from "../table.styles";
import { TableCaptionFactoryPayload } from "../table.types";

const TableCaption = factory<TableCaptionFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { size, getStyles } = useTableContext();
        const sizeStyles = getSize(size);

        return (
            <caption
                ref={ref}
                className={cx(
                    "caption-bottom mt-2 text-[var(--refraktor-text-secondary)]",
                    sizeStyles.caption,
                    getStyles("caption"),
                    className
                )}
                {...props}
            >
                {children}
            </caption>
        );
    }
);

TableCaption.displayName = "@refraktor/core/Table.Caption";

export default TableCaption;
