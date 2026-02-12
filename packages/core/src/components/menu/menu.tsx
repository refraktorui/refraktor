import { useId } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { MenuFactoryPayload, MenuClassNames, MenuProps } from "./menu.types";
import { useMenu } from "./use-menu";
import {
    MenuLevelProvider,
    MenuRootProvider,
    useMenuItemsRegistry
} from "./menu.context";
import { MenuTrigger } from "./menu-trigger";
import { MenuDropdown } from "./menu-dropdown";
import { MenuItem } from "./menu-item";
import { MenuLabel } from "./menu-label";
import { MenuSeparator } from "./menu-separator";
import { MenuSub } from "./menu-sub";
import { MenuSubTrigger } from "./menu-sub-trigger";
import { MenuSubDropdown } from "./menu-sub-dropdown";

const defaultProps = {
    positioning: {
        placement: "bottom-start",
        offset: 4
    },
    middlewares: { flip: true, shift: true },
    trigger: "click",
    openDelay: 0,
    closeDelay: 100,
    radius: "default",
    withinPortal: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    closeOnItemClick: true
} satisfies Partial<MenuProps>;

const Menu = factory<MenuFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        trigger,
        openDelay,
        closeDelay,
        transitionProps,
        radius,
        withinPortal,
        closeOnClickOutside,
        closeOnEscape,
        closeOnItemClick,
        className,
        classNames,
        ...props
    } = useProps("Menu", defaultProps, _props);
    const classes = useClassNames("Menu", classNames);
    const _id = useId(id);

    const menu = useMenu({
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        trigger,
        closeOnClickOutside,
        closeOnEscape,
        openDelay,
        closeDelay
    });

    const registry = useMenuItemsRegistry();

    const getStyles = (part: keyof MenuClassNames) => classes[part];

    return (
        <MenuRootProvider
            value={{
                radius: radius ?? "default",
                withinPortal: withinPortal ?? true,
                closeOnItemClick: closeOnItemClick ?? true,
                transitionProps,
                classNames,
                getStyles
            }}
        >
            <MenuLevelProvider
                value={{
                    menu,
                    isSubmenu: false,
                    registerItem: registry.registerItem,
                    getItems: registry.getItems,
                    closeMenu: menu.close,
                    closeAllMenus: menu.close
                }}
            >
                <div
                    ref={ref}
                    id={_id}
                    className={cx("inline-block", classes.root, className)}
                    {...props}
                >
                    {children}
                </div>
            </MenuLevelProvider>
        </MenuRootProvider>
    );
});

Menu.displayName = "@refraktor/core/Menu";
Menu.configure = createComponentConfig<MenuProps>();
Menu.classNames = createClassNamesConfig<MenuClassNames>();
Menu.Trigger = MenuTrigger;
Menu.Dropdown = MenuDropdown;
Menu.Item = MenuItem;
Menu.Label = MenuLabel;
Menu.Separator = MenuSeparator;
Menu.Sub = MenuSub;
Menu.SubTrigger = MenuSubTrigger;
Menu.SubDropdown = MenuSubDropdown;

export default Menu;
