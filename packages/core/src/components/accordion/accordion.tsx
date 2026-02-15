import { useId, useUncontrolled } from "@refraktor/utils";
import { useCallback, useEffect, useMemo } from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    AccordionProvider,
    getNavigableAccordionItems,
    useAccordionItemsRegistry
} from "./accordion.context";
import { AccordionControl } from "./accordion-control";
import { AccordionItem } from "./accordion-item";
import { AccordionPanel } from "./accordion-panel";
import {
    AccordionClassNames,
    AccordionFactoryPayload,
    AccordionProps,
    AccordionValue
} from "./accordion.types";

const defaultProps = {
    multiple: false,
    collapsible: true,
    keepMounted: false,
    size: "md",
    radius: "default",
    variant: "default"
} satisfies Partial<AccordionProps>;

const toDomSafeValue = (value: string) =>
    encodeURIComponent(value).replace(/%/g, "-");

const normalizeOpenValues = (
    value: AccordionValue | undefined,
    multiple: boolean
) => {
    if (Array.isArray(value)) {
        const uniqueValues = Array.from(new Set(value.filter(Boolean)));

        if (!multiple) {
            return uniqueValues.slice(0, 1);
        }

        return uniqueValues;
    }

    if (typeof value === "string" && value.length > 0) {
        return [value];
    }

    return [];
};

const Accordion = factory<AccordionFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        value,
        defaultValue,
        onChange,
        multiple,
        collapsible,
        keepMounted,
        size,
        radius,
        variant,
        className,
        classNames,
        ...props
    } = useProps("Accordion", defaultProps, _props);
    const classes = useClassNames("Accordion", classNames);
    const _id = useId(id);

    const [activeValue, setActiveValue, isControlled] =
        useUncontrolled<AccordionValue>({
            value,
            defaultValue,
            finalValue: multiple ? [] : null,
            onChange
        });

    const openValues = useMemo(
        () => normalizeOpenValues(activeValue, multiple),
        [activeValue, multiple]
    );

    const { registerItem, getItems } = useAccordionItemsRegistry();

    useEffect(() => {
        if (multiple || collapsible || openValues.length > 0 || isControlled) {
            return;
        }

        const firstItem = getNavigableAccordionItems(getItems())[0];

        if (firstItem) {
            setActiveValue(firstItem.value);
        }
    }, [
        multiple,
        collapsible,
        openValues.length,
        isControlled,
        getItems,
        setActiveValue
    ]);

    const toggleItem = useCallback(
        (itemValue: string) => {
            const isOpen = openValues.includes(itemValue);

            if (multiple) {
                const nextValues = isOpen
                    ? openValues.filter((value) => value !== itemValue)
                    : [...openValues, itemValue];

                setActiveValue(nextValues);
                return;
            }

            if (isOpen) {
                if (collapsible) {
                    setActiveValue(null);
                }

                return;
            }

            setActiveValue(itemValue);
        },
        [multiple, collapsible, openValues, setActiveValue]
    );

    const isItemOpen = useCallback(
        (itemValue: string) => openValues.includes(itemValue),
        [openValues]
    );

    const getControlId = useCallback(
        (itemValue: string) => `${_id}-control-${toDomSafeValue(itemValue)}`,
        [_id]
    );

    const getPanelId = useCallback(
        (itemValue: string) => `${_id}-panel-${toDomSafeValue(itemValue)}`,
        [_id]
    );

    const getStyles = useCallback(
        (part: keyof AccordionClassNames) => classes[part],
        [classes]
    );

    return (
        <AccordionProvider
            value={{
                openValues,
                multiple,
                collapsible,
                keepMounted,
                size,
                radius,
                variant,
                toggleItem,
                isItemOpen,
                registerItem,
                getItems,
                getControlId,
                getPanelId,
                getStyles
            }}
        >
            <div
                ref={ref}
                id={_id}
                className={cx(
                    "w-full flex flex-col",
                    variant === "separated" ? "gap-2" : "gap-0",
                    classes.root,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </AccordionProvider>
    );
});

Accordion.displayName = "@refraktor/core/Accordion";
Accordion.configure = createComponentConfig<AccordionProps>();
Accordion.classNames = createClassNamesConfig<AccordionClassNames>();
Accordion.Item = AccordionItem;
Accordion.Control = AccordionControl;
Accordion.Panel = AccordionPanel;

export default Accordion;
