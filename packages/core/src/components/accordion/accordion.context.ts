import { createSafeContext } from "@refraktor/utils";
import { MutableRefObject, useCallback, useRef } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import { AccordionClassNames, AccordionVariant } from "./accordion.types";

export interface AccordionItemRegistration {
    value: string;
    ref: MutableRefObject<HTMLElement | null>;
    disabled: boolean;
}

export interface AccordionContextValue {
    openValues: string[];
    multiple: boolean;
    collapsible: boolean;
    keepMounted: boolean;
    size: RefraktorSize;
    radius: RefraktorRadius;
    variant: AccordionVariant;
    toggleItem: (value: string) => void;
    isItemOpen: (value: string) => boolean;
    registerItem: (item: AccordionItemRegistration) => () => void;
    getItems: () => AccordionItemRegistration[];
    getControlId: (value: string) => string;
    getPanelId: (value: string) => string;
    getStyles: (part: keyof AccordionClassNames) => string | undefined;
}

export interface AccordionItemContextValue {
    value: string;
    disabled: boolean;
}

export const [AccordionProvider, useAccordionContext] =
    createSafeContext<AccordionContextValue>(
        "Accordion component was not found in tree. Make sure Accordion.Item, Accordion.Control and Accordion.Panel are wrapped with Accordion."
    );

export const [AccordionItemProvider, useAccordionItemContext] =
    createSafeContext<AccordionItemContextValue>(
        "Accordion.Item component was not found in tree. Make sure Accordion.Control and Accordion.Panel are wrapped with Accordion.Item."
    );

export function useAccordionItemsRegistry() {
    const itemsRef = useRef<AccordionItemRegistration[]>([]);

    const registerItem = useCallback((item: AccordionItemRegistration) => {
        itemsRef.current = [
            ...itemsRef.current.filter((x) => x.value !== item.value),
            item
        ];

        return () => {
            itemsRef.current = itemsRef.current.filter(
                (x) => x.value !== item.value
            );
        };
    }, []);

    const getItems = useCallback(() => sortAccordionItems(itemsRef.current), []);

    return {
        registerItem,
        getItems
    };
}

export function sortAccordionItems(items: AccordionItemRegistration[]) {
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

export function getNavigableAccordionItems(items: AccordionItemRegistration[]) {
    return items.filter((item) => !item.disabled);
}
