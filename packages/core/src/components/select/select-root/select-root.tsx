import { useId, useUncontrolled } from "@refraktor/utils";
import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory, useClassNames, useProps } from "../../../utils";
import {
    focusSelectItem,
    getNavigableSelectItems,
    SelectProvider,
    useSelectItemsRegistry
} from "../select.context";
import type {
    SelectContextValue,
    SelectItemRegistration
} from "../select.context";
import type {
    SelectClassNames,
    SelectRootFactoryPayload,
    SelectRootProps
} from "../select.types";
import { useSelect } from "../use-select";

const defaultProps = {
    positioning: {
        placement: "bottom-start",
        offset: 4
    },
    middlewares: { flip: true, shift: true },
    searchable: false,
    placeholder: "Select option",
    searchPlaceholder: "Search...",
    nothingFound: "No options",
    size: "md",
    radius: "default",
    variant: "default",
    withinPortal: true,
    closeOnClickOutside: true,
    closeOnEscape: true
} satisfies Partial<SelectRootProps>;

const SelectRoot = factory<SelectRootFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        value,
        defaultValue,
        onChange,
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        searchable,
        searchValue,
        defaultSearchValue,
        onSearchChange,
        placeholder,
        searchPlaceholder,
        nothingFound,
        size,
        radius,
        variant,
        withinPortal,
        closeOnClickOutside,
        closeOnEscape,
        transitionProps,
        className,
        classNames,
        ...props
    } = useProps("Select", defaultProps, _props);
    const classes = useClassNames("Select", classNames);

    const _id = useId(id);
    const listId = `${_id}-listbox`;
    const triggerId = `${_id}-trigger`;

    const [selectedValue, setSelectedValue] = useUncontrolled<string | null>({
        value,
        defaultValue,
        finalValue: null,
        onChange
    });

    const [search, setSearch] = useUncontrolled<string>({
        value: searchValue,
        defaultValue: defaultSearchValue,
        finalValue: "",
        onChange: onSearchChange
    });

    const select = useSelect({
        opened,
        defaultOpened,
        onOpenedChange,
        positioning,
        middlewares,
        disabled,
        closeOnClickOutside,
        closeOnEscape
    });

    const { registerItem: registerRegistryItem, getItems } =
        useSelectItemsRegistry();
    const labelsRef = useRef(new Map<string, string>());
    const triggerInputRef = useRef<HTMLInputElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const normalizedSearch = search.trim().toLowerCase();

    const isSearchMatch = useCallback(
        (textValue: string) => {
            if (!normalizedSearch) {
                return true;
            }

            return textValue.toLowerCase().includes(normalizedSearch);
        },
        [normalizedSearch]
    );

    const getVisibleItems = useCallback(
        () => getItems().filter((item) => isSearchMatch(item.textValue)),
        [getItems, isSearchMatch]
    );

    const hasVisibleItems = useCallback(
        () => getVisibleItems().length > 0,
        [getVisibleItems]
    );

    const isGroupVisible = useCallback(
        (groupId: string) => {
            if (!normalizedSearch) {
                return true;
            }

            const groupItems = getItems().filter(
                (item) => item.groupId === groupId
            );

            if (!groupItems.length) {
                return true;
            }

            return groupItems.some((item) => isSearchMatch(item.textValue));
        },
        [getItems, isSearchMatch, normalizedSearch]
    );

    const getSelectedLabel = useCallback(() => {
        if (!selectedValue) {
            return "";
        }

        return labelsRef.current.get(selectedValue) ?? selectedValue;
    }, [selectedValue]);

    const focusFirstItem = useCallback(() => {
        const items = getNavigableSelectItems(getVisibleItems());
        focusSelectItem(items[0]);
    }, [getVisibleItems]);

    const focusLastItem = useCallback(() => {
        const items = getNavigableSelectItems(getVisibleItems());
        focusSelectItem(items[items.length - 1]);
    }, [getVisibleItems]);

    const focusSelectedOrFirstItem = useCallback(() => {
        const items = getNavigableSelectItems(getVisibleItems());

        if (!items.length) {
            return;
        }

        const selectedItem = items.find((item) => item.value === selectedValue);
        focusSelectItem(selectedItem ?? items[0]);
    }, [getVisibleItems, selectedValue]);

    const selectValue = useCallback(
        (nextValue: string, label: string) => {
            labelsRef.current.set(nextValue, label);
            setSelectedValue(nextValue);
            select.close();
        },
        [select, setSelectedValue]
    );

    const registerItem = useCallback(
        (item: SelectItemRegistration) => {
            labelsRef.current.set(item.value, item.label);
            return registerRegistryItem(item);
        },
        [registerRegistryItem]
    );

    useEffect(() => {
        if (!select.opened && search) {
            setSearch("");
        }
    }, [search, select.opened, setSearch]);

    const getStyles = useCallback(
        (part: keyof SelectClassNames) => classes[part],
        [classes]
    );

    const context: SelectContextValue = {
        select,
        value: selectedValue,
        selectValue,
        searchable: !!searchable,
        search,
        setSearch,
        placeholder,
        searchPlaceholder,
        nothingFound,
        disabled: !!disabled,
        size,
        radius,
        variant,
        withinPortal: !!withinPortal,
        transitionProps,
        listId,
        triggerId,
        triggerInputRef,
        searchInputRef,
        registerItem,
        getItems,
        getVisibleItems,
        hasVisibleItems,
        isSearchMatch,
        isGroupVisible,
        getSelectedLabel,
        focusFirstItem,
        focusLastItem,
        focusSelectedOrFirstItem,
        getStyles
    };

    return (
        <SelectProvider value={context}>
            <div
                ref={ref}
                id={_id}
                className={cx("relative w-full", classes.root, className)}
                {...props}
            >
                {children}
            </div>
        </SelectProvider>
    );
});

SelectRoot.displayName = "@refraktor/core/Select.Root";

export default SelectRoot;
