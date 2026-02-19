import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { DrawerClose } from "../drawer-close";
import { useDrawerContext } from "../drawer.context";
import { DrawerHeaderFactoryPayload } from "../drawer.types";

const DrawerHeader = factory<DrawerHeaderFactoryPayload>(
    ({ children, className, id, text, withClose = true, ...props }, ref) => {
        const { cx } = useTheme();
        const { headerId, getStyles } = useDrawerContext();
        const resolvedId = id ?? headerId;

        return (
            <div
                ref={ref}
                className={cx(
                    "mb-4 flex items-center justify-between",
                    getStyles("header"),
                    className
                )}
                {...props}
            >
                <div
                    id={resolvedId}
                    className="min-w-0 flex-1 text-sm font-semibold leading-5 text-[var(--refraktor-text)]"
                >
                    {text ?? children}
                </div>

                {withClose && (
                    <DrawerClose className="static shrink-0 self-center" />
                )}
            </div>
        );
    }
);

DrawerHeader.displayName = "@refraktor/core/Drawer.Header";

export default DrawerHeader;
