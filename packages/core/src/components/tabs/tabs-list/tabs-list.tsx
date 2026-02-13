import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTabsContext } from "../tabs.context";
import { getSize, getVariant } from "../tabs.styles";
import { TabsListFactoryPayload } from "../tabs.types";

const TabsList = factory<TabsListFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const { orientation, size, radius, variant, getStyles } =
            useTabsContext();

        const sizeStyles = getSize(size);
        const variantStyles = getVariant(variant, orientation);

        return (
            <div
                ref={ref}
                role="tablist"
                aria-orientation={orientation}
                className={cx(
                    "inline-flex shrink-0",
                    orientation === "horizontal"
                        ? "w-full flex-row items-center"
                        : "flex-col items-stretch",
                    sizeStyles.list,
                    variantStyles.list,
                    variant !== "underline" && getRadius(radius),
                    getStyles("list"),
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

TabsList.displayName = "@refraktor/core/Tabs.List";

export default TabsList;
