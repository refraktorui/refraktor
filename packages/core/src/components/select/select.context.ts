import { createOptionalContext, createSafeContext } from "@refraktor/utils";
import { useCallback, useRef } from "react";
import type { MutableRefObject, ReactNode } from "react";
import type { RefraktorRadius, RefraktorSize } from "../../theme";
import type { InputVariant } from "../input";
import type { TransitionProps } from "../transition";
import type { SelectClassNames } from "./select.types";
import type { UseSelectReturn } from "./use-select";

export interface SelectItemRegistration {
    id: string;
    value: string;
    ref: MutableRefObject<HTMLElement | null>;
    disabled: boolean;
    label: string;
    textValue: string;
    groupId?: string;
    select: () => void;
}

export interface SelectContextValue {
    select: UseSelectReturn;
    value: string | null;
    selectValue: (value: string, label: string) => void;
    searchable: boolean;
    search: string;
    setSearch: (value: string) => void;
    placeholder: string;
    searchPlaceholder: string;
    nothingFound: ReactNode;
    disabled: boolean;
    size: RefraktorSize;
    radius: RefraktorRadius;
    variant: InputVariant;
    withinPortal: boolean;
    transitionProps?: Omit<TransitionProps, "children" | "mounted">;
    listId: string;
    triggerId: string;
    triggerInputRef: MutableRefObject<HTMLInputElement | null>;
    searchInputRef: MutableRefObject<HTMLInputElement | null>;
    registerItem: (item: SelectItemRegistration) => () => void;
    getItems: () => SelectItemRegistration[];
    getVisibleItems: () => SelectItemRegistration[];
    hasVisibleItems: () => boolean;
    isSearchMatch: (textValue: string) => boolean;
    isGroupVisible: (groupId: string) => boolean;
    getSelectedLabel: () => string;
    focusFirstItem: () => void;
    focusLastItem: () => void;
    focusSelectedOrFirstItem: () => void;
    getStyles: (part: keyof SelectClassNames) => string | undefined;
}

export interface SelectGroupContextValue {
    groupId: string;
}

export const [SelectProvider, useSelectContext] =
    createSafeContext<SelectContextValue>(
        "Select component was not found in tree. Make sure Select.Trigger, Select.Dropdown, Select.Group and Select.Item are wrapped with Select.Root or Select."
    );

export const [SelectGroupProvider, useSelectGroupContext] =
    createOptionalContext<SelectGroupContextValue>();

export function useSelectItemsRegistry() {
    const itemsRef = useRef<SelectItemRegistration[]>([]);

    const registerItem = useCallback((item: SelectItemRegistration) => {
        itemsRef.current = [
            ...itemsRef.current.filter((x) => x.id !== item.id),
            item
        ];

        return () => {
            itemsRef.current = itemsRef.current.filter((x) => x.id !== item.id);
        };
    }, []);

    const getItems = useCallback(() => sortSelectItems(itemsRef.current), []);

    return {
        registerItem,
        getItems
    };
}

export function sortSelectItems(items: SelectItemRegistration[]) {
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

export function getNavigableSelectItems(items: SelectItemRegistration[]) {
    return items.filter((item) => !item.disabled);
}

export function findFocusedSelectItemIndex(items: SelectItemRegistration[]) {
    return items.findIndex((item) => item.ref.current === document.activeElement);
}

export function focusSelectItem(item?: SelectItemRegistration) {
    item?.ref.current?.focus();
}

export function getNodeTextValue(
    children: ReactNode,
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
