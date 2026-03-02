import { useCallback } from "react";
import { useTheme } from "../../../theme";
import { factory, useProps } from "../../../utils";
import { MenuSubFactoryPayload, MenuSubProps } from "../menu.types";
import {
    focusMenuItem,
    getNavigableMenuItems,
    MenuSubProvider,
    useMenuItemsRegistry,
    useMenuLevelContext
} from "../menu.context";
import { useMenu } from "../use-menu";

const defaultProps = {
    positioning: {
        placement: "right-start",
        offset: 4
    },
    strategy: "fixed",
    middlewares: { flip: true, shift: true },
    trigger: "hover",
    openDelay: 75,
    closeDelay: 125,
    closeOnClickOutside: false,
    closeOnEscape: true,
    disabled: false
} satisfies Partial<MenuSubProps>;

const MenuSub = factory<MenuSubFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        children,
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        strategy,
        middlewares,
        disabled,
        trigger,
        openDelay,
        closeDelay,
        closeOnClickOutside,
        closeOnEscape,
        className,
        ...props
    } = useProps("MenuSub", defaultProps, _props);
    const parentLevel = useMenuLevelContext();

    const submenu = useMenu({
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        strategy,
        middlewares,
        disabled,
        trigger,
        openDelay,
        closeDelay,
        closeOnClickOutside,
        closeOnEscape
    });

    const registry = useMenuItemsRegistry();

    const submenuLevel = {
        menu: submenu,
        isSubmenu: true,
        registerItem: registry.registerItem,
        getItems: registry.getItems,
        closeMenu: submenu.close,
        closeAllMenus: () => {
            submenu.close();
            parentLevel.closeAllMenus();
        }
    };

    const openSubmenu = useCallback(
        (focusFirstItem?: boolean) => {
            if (disabled) {
                return;
            }

            submenu.open();

            if (focusFirstItem) {
                requestAnimationFrame(() => {
                    const items = getNavigableMenuItems(submenuLevel.getItems());
                    focusMenuItem(items[0]);
                });
            }
        },
        [disabled, submenu, submenuLevel]
    );

    const closeSubmenu = useCallback(() => {
        submenu.close();
    }, [submenu]);

    return (
        <MenuSubProvider
            value={{
                submenuLevel,
                parentLevel,
                disabled: !!disabled,
                openSubmenu,
                closeSubmenu
            }}
        >
            <div ref={ref} className={cx(className)} {...props}>
                {children}
            </div>
        </MenuSubProvider>
    );
});

MenuSub.displayName = "@refraktor/core/Menu.Sub";

export default MenuSub;
