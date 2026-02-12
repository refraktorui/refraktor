import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { MenuSeparatorFactoryPayload } from "../menu.types";
import { useMenuRootContext } from "../menu.context";

const MenuSeparator = factory<MenuSeparatorFactoryPayload>(
    ({ className, ...props }, ref) => {
        const { cx } = useTheme();
        const { getStyles } = useMenuRootContext();

        return (
            <div
                ref={ref}
                role="separator"
                className={cx(
                    "my-1 h-px bg-[var(--refraktor-border)]",
                    getStyles("separator"),
                    className
                )}
                {...props}
            />
        );
    }
);

MenuSeparator.displayName = "@refraktor/core/Menu.Separator";

export default MenuSeparator;
