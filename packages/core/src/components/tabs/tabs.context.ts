import { createSafeContext } from "@refraktor/utils";
import { MutableRefObject, useCallback, useRef } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    TabsActivationMode,
    TabsClassNames,
    TabsOrientation,
    TabsVariant
} from "./tabs.types";

export interface TabRegistration {
    value: string;
    ref: MutableRefObject<HTMLElement | null>;
    disabled: boolean;
}

export interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
    orientation: TabsOrientation;
    activationMode: TabsActivationMode;
    loop: boolean;
    keepMounted: boolean;
    size: RefraktorSize;
    radius: RefraktorRadius;
    variant: TabsVariant;
    registerTab: (tab: TabRegistration) => () => void;
    getTabs: () => TabRegistration[];
    getTabId: (value: string) => string;
    getPanelId: (value: string) => string;
    getStyles: (part: keyof TabsClassNames) => string | undefined;
}

export const [TabsProvider, useTabsContext] =
    createSafeContext<TabsContextValue>(
        "Tabs component was not found in tree. Make sure Tabs.List, Tabs.Tab and Tabs.Panel are wrapped with Tabs."
    );

export function useTabsRegistry() {
    const tabsRef = useRef<TabRegistration[]>([]);

    const registerTab = useCallback((tab: TabRegistration) => {
        tabsRef.current = [
            ...tabsRef.current.filter((x) => x.value !== tab.value),
            tab
        ];

        return () => {
            tabsRef.current = tabsRef.current.filter(
                (x) => x.value !== tab.value
            );
        };
    }, []);

    const getTabs = useCallback(() => sortTabs(tabsRef.current), []);

    return {
        registerTab,
        getTabs
    };
}

export function sortTabs(tabs: TabRegistration[]) {
    return [...tabs].sort((a, b) => {
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

export function getNavigableTabs(tabs: TabRegistration[]) {
    return tabs.filter((tab) => !tab.disabled);
}
