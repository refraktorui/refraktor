import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useTabsContext } from "../tabs.context";
import { getSize, getVariant } from "../tabs.styles";
import { TabsPanelFactoryPayload } from "../tabs.types";

const TabsPanel = factory<TabsPanelFactoryPayload>(
    ({ value, children, className, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const {
            value: activeValue,
            keepMounted,
            orientation,
            size,
            radius,
            variant,
            getTabId,
            getPanelId,
            getStyles
        } = useTabsContext();

        const isActive = activeValue === value;

        if (!keepMounted && !isActive) {
            return null;
        }

        const sizeStyles = getSize(size);
        const variantStyles = getVariant(variant, orientation);

        return (
            <div
                ref={ref}
                id={getPanelId(value)}
                role="tabpanel"
                aria-labelledby={getTabId(value)}
                data-active={isActive}
                tabIndex={isActive ? 0 : -1}
                hidden={!isActive}
                className={cx(
                    "outline-none",
                    sizeStyles.panel,
                    variantStyles.panel,
                    variant !== "underline" && getRadius(radius),
                    getStyles("panel"),
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

TabsPanel.displayName = "@refraktor/core/Tabs.Panel";

export default TabsPanel;
