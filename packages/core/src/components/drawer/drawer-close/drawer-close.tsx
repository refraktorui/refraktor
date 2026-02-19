import { XIcon } from "../../../icons";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useDrawerContext } from "../drawer.context";
import { DrawerCloseFactoryPayload } from "../drawer.types";

const DrawerClose = factory<DrawerCloseFactoryPayload>(
    ({ children, className, onClick, type = "button", ...props }, ref) => {
        const { cx } = useTheme();
        const { drawer, getStyles } = useDrawerContext();

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);

            if (event.defaultPrevented) {
                return;
            }

            drawer.close();
        };

        return (
            <button
                ref={ref}
                type={type}
                aria-label="Close"
                className={cx(
                    "size-6 cursor-pointer text-[var(--refraktor-text-secondary)] transition-colors hover:text-[var(--refraktor-text)]",
                    getStyles("close"),
                    className
                )}
                onClick={handleClick}
                {...props}
            >
                {children ?? <XIcon />}
            </button>
        );
    }
);

DrawerClose.displayName = "@refraktor/core/Drawer.Close";

export default DrawerClose;
