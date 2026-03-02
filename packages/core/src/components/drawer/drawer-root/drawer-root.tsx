import { useId } from "@refraktor/utils";
import { useTheme } from "../../../theme";
import { factory, useClassNames, useProps } from "../../../utils";
import { DrawerProvider } from "../drawer.context";
import { useDrawer } from "../use-drawer";
import {
    DrawerClassNames,
    DrawerRootFactoryPayload,
    DrawerRootProps
} from "../drawer.types";

const defaultProps = {
    closeOnClickOutside: true,
    closeOnEscape: true,
    strategy: "absolute",
    lockScroll: true,
    withinPortal: true,
    radius: "none",
    position: "right",
    size: "md",
    trapFocus: true,
    returnFocus: true
} satisfies Partial<DrawerRootProps>;

const DrawerRoot = factory<DrawerRootFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside,
        closeOnEscape,
        strategy,
        lockScroll,
        withinPortal,
        radius,
        position,
        size,
        trapFocus,
        returnFocus,
        transitionProps,
        className,
        classNames,
        ...props
    } = useProps("Drawer", defaultProps, _props);
    const classes = useClassNames("Drawer", classNames);

    const _id = useId(id);
    const headerId = `${_id}-header`;

    const drawer = useDrawer({
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside,
        closeOnEscape,
        strategy
    });

    const getStyles = (part: keyof DrawerClassNames) => classes[part];

    return (
        <DrawerProvider
            value={{
                drawer,
                closeOnClickOutside,
                lockScroll,
                withinPortal,
                radius,
                position,
                size,
                trapFocus,
                returnFocus,
                transitionProps,
                headerId,
                classNames,
                getStyles
            }}
        >
            <div
                ref={ref}
                id={_id}
                className={cx(classes.root, className)}
                {...props}
            >
                {children}
            </div>
        </DrawerProvider>
    );
});

DrawerRoot.displayName = "@refraktor/core/Drawer.Root";

export default DrawerRoot;
