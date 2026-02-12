import { createSafeContext } from "@refraktor/utils";
import { useCallback, useRef } from "react";
import { RefraktorRadius } from "../../theme";
import { TransitionProps } from "../transition";
import { MenuClassNames } from "./menu.types";
import { UseMenuReturn } from "./use-menu";

export interface MenuItemRegistration {
    id: string;
    ref: React.MutableRefObject<HTMLElement | null>;
    disabled: boolean;
    textValue: string;
    hasSubmenu?: boolean;
    openSubmenu?: (focusFirstItem?: boolean) => void;
}

export interface MenuRootContextValue {
    radius: RefraktorRadius;
    withinPortal: boolean;
    closeOnItemClick: boolean;
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;
    classNames?: MenuClassNames;
    getStyles: (part: keyof MenuClassNames) => string | undefined;
}

export interface MenuLevelContextValue {
    menu: UseMenuReturn;
    isSubmenu: boolean;
    registerItem: (item: MenuItemRegistration) => () => void;
    getItems: () => MenuItemRegistration[];
    closeMenu: () => void;
    closeAllMenus: () => void;
}

export interface MenuSubContextValue {
    submenuLevel: MenuLevelContextValue;
    parentLevel: MenuLevelContextValue;
    disabled: boolean;
    openSubmenu: (focusFirstItem?: boolean) => void;
    closeSubmenu: () => void;
}

export const [MenuRootProvider, useMenuRootContext] =
    createSafeContext<MenuRootContextValue>(
        "Menu component was not found in tree. Make sure Menu components are wrapped with Menu."
    );

export const [MenuLevelProvider, useMenuLevelContext] =
    createSafeContext<MenuLevelContextValue>(
        "Menu dropdown context was not found in tree. Make sure Menu.Item and related components are inside Menu.Dropdown or Menu.SubDropdown."
    );

export const [MenuSubProvider, useMenuSubContext] =
    createSafeContext<MenuSubContextValue>(
        "Menu.Sub context was not found in tree. Make sure Menu.SubTrigger and Menu.SubDropdown are inside Menu.Sub."
    );

export function useMenuItemsRegistry() {
    const itemsRef = useRef<MenuItemRegistration[]>([]);

    const registerItem = useCallback((item: MenuItemRegistration) => {
        itemsRef.current = [...itemsRef.current.filter((x) => x.id !== item.id), item];

        return () => {
            itemsRef.current = itemsRef.current.filter((x) => x.id !== item.id);
        };
    }, []);

    const getItems = useCallback(() => sortMenuItems(itemsRef.current), []);

    return {
        registerItem,
        getItems
    };
}

export function sortMenuItems(items: MenuItemRegistration[]) {
    return [...items].sort((a, b) => {
        const aNode = a.ref.current;
        const bNode = b.ref.current;

        if (!aNode || !bNode || aNode === bNode) {
            return 0;
        }

        const position = aNode.compareDocumentPosition(bNode);

        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            return -1;
        }

        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            return 1;
        }

        return 0;
    });
}

export function getNavigableMenuItems(items: MenuItemRegistration[]) {
    return items.filter((item) => !item.disabled);
}

export function findFocusedMenuItemIndex(items: MenuItemRegistration[]) {
    return items.findIndex((item) => item.ref.current === document.activeElement);
}

export function focusMenuItem(item?: MenuItemRegistration) {
    item?.ref.current?.focus();
}

export function findTypeaheadMatch(
    items: MenuItemRegistration[],
    search: string,
    currentIndex: number
) {
    if (!items.length || !search) {
        return -1;
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
        return -1;
    }

    const getNormalizedText = (item: MenuItemRegistration) =>
        item.textValue.trim().toLowerCase();

    for (let index = currentIndex + 1; index < items.length; index++) {
        const item = items[index];

        if (getNormalizedText(item).startsWith(normalizedSearch)) {
            return index;
        }
    }

    for (let index = 0; index <= currentIndex; index++) {
        const item = items[index];

        if (getNormalizedText(item).startsWith(normalizedSearch)) {
            return index;
        }
    }

    return -1;
}

export function getNodeTextValue(
    children: React.ReactNode,
    explicitTextValue?: string
) {
    if (explicitTextValue) {
        return explicitTextValue;
    }

    if (typeof children === "string" || typeof children === "number") {
        return String(children);
    }

    return "";
}
