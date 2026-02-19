import { useId } from "@refraktor/utils";
import { useRef } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { useTheme } from "../../../theme";
import { factory, useClassNames, useProps } from "../../../utils";
import { DrawerProvider } from "../drawer.context";
import {
    DrawerClassNames,
    DrawerRootFactoryPayload,
    DrawerRootProps
} from "../drawer.types";
import { useDrawer } from "../use-drawer";

const defaultProps = {
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
    withinPortal: true,
    radius: "none",
    position: "right",
    size: "md"
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
        lockScroll,
        withinPortal,
        radius,
        position,
        size,
        transitionProps,
        className,
        classNames,
        ...props
    } = useProps("Drawer", defaultProps, _props);
    const classes = useClassNames("Drawer", classNames);

    const _id = useId(id);
    const headerId = `${_id}-header`;
    const contentRef = useRef<HTMLDivElement | null>(null);

    const drawer = useDrawer({
        opened,
        defaultOpened,
        onOpenedChange,
        closeOnClickOutside,
        closeOnEscape,
        contentRef
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
                transitionProps,
                headerId,
                contentRef,
                classNames,
                getStyles
            }}
        >
            <RemoveScroll enabled={drawer.opened && lockScroll}>
                <div
                    ref={ref}
                    id={_id}
                    className={cx(classes.root, className)}
                    {...props}
                >
                    {children}
                </div>
            </RemoveScroll>
        </DrawerProvider>
    );
});

DrawerRoot.displayName = "@refraktor/core/Drawer.Root";

export default DrawerRoot;
