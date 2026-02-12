import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { MenuLabelFactoryPayload } from "../menu.types";
import { useMenuRootContext } from "../menu.context";

const MenuLabel = factory<MenuLabelFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { getStyles } = useMenuRootContext();

        return (
            <div
                ref={ref}
                role="presentation"
                className={cx(
                    "px-2 py-1 text-xs font-medium text-[var(--refraktor-text-secondary)]",
                    getStyles("label"),
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

MenuLabel.displayName = "@refraktor/core/Menu.Label";

export default MenuLabel;
