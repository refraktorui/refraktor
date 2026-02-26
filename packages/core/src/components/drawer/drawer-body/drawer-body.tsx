import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { useDrawerContext } from "../drawer.context";
import { DrawerBodyFactoryPayload } from "../drawer.types";

const DrawerBody = factory<DrawerBodyFactoryPayload>(
    ({ children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const { getStyles } = useDrawerContext();

        return (
            <div
                ref={ref}
                className={cx(
                    "overflow-y-auto",
                    getStyles("body"),
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

DrawerBody.displayName = "@refraktor/core/Drawer.Body";

export default DrawerBody;
