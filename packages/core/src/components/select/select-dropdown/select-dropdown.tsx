import { useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { InputField } from "../../input/input-field";
import { Transition } from "../../transition";
import {
    findFocusedSelectItemIndex,
    focusSelectItem,
    getNavigableSelectItems,
    useSelectContext
} from "../select.context";
import type { SelectDropdownFactoryPayload } from "../select.types";
import {
    FloatingFocusManager,
    FloatingPortal,
    useMergeRefs
} from "@floating-ui/react";

const SelectDropdown = factory<SelectDropdownFactoryPayload>(
    ({ children, className, style, onKeyDown, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const select = useSelectContext();

        const typeaheadRef = useRef("");
        const typeaheadTimeoutRef = useRef<number | null>(null);

        useEffect(() => {
            return () => {
                if (typeaheadTimeoutRef.current !== null) {
                    window.clearTimeout(typeaheadTimeoutRef.current);
                }
            };
        }, []);

        useEffect(() => {
            if (!select.select.opened) {
                return;
            }

            requestAnimationFrame(() => {
                if (select.searchable) {
                    select.searchInputRef.current?.focus();
                    return;
                }

                select.focusSelectedOrFirstItem();
            });
        }, [
            select.focusSelectedOrFirstItem,
            select.searchable,
            select.searchInputRef,
            select.select.opened
        ]);

        const clearTypeahead = () => {
            typeaheadRef.current = "";

            if (typeaheadTimeoutRef.current !== null) {
                window.clearTimeout(typeaheadTimeoutRef.current);
                typeaheadTimeoutRef.current = null;
            }
        };

        const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
            onKeyDown?.(event as any);

            if (event.defaultPrevented) {
                return;
            }

            const items = getNavigableSelectItems(select.getVisibleItems());
            const focusedIndex = findFocusedSelectItemIndex(items);
            const isSearchInputTarget =
                event.target === select.searchInputRef.current;

            if (event.key === "ArrowDown") {
                event.preventDefault();

                if (!items.length) {
                    return;
                }

                const nextIndex =
                    focusedIndex >= 0 ? (focusedIndex + 1) % items.length : 0;

                focusSelectItem(items[nextIndex]);
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                if (!items.length) {
                    return;
                }

                const nextIndex =
                    focusedIndex >= 0
                        ? (focusedIndex - 1 + items.length) % items.length
                        : items.length - 1;

                focusSelectItem(items[nextIndex]);
                return;
            }

            if (event.key === "Home") {
                event.preventDefault();
                focusSelectItem(items[0]);
                return;
            }

            if (event.key === "End") {
                event.preventDefault();
                focusSelectItem(items[items.length - 1]);
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                select.select.close();
                select.triggerInputRef.current?.focus();
                return;
            }

            if (event.key === "Tab") {
                select.select.close();
                return;
            }

            if (
                (event.key === "Enter" || event.key === " ") &&
                !isSearchInputTarget
            ) {
                if (focusedIndex === -1) {
                    return;
                }

                event.preventDefault();
                items[focusedIndex].select();
                return;
            }

            if (
                !select.searchable &&
                event.key.length === 1 &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
            ) {
                const search = `${typeaheadRef.current}${event.key.toLowerCase()}`;
                typeaheadRef.current = search;

                if (typeaheadTimeoutRef.current !== null) {
                    window.clearTimeout(typeaheadTimeoutRef.current);
                }

                typeaheadTimeoutRef.current = window.setTimeout(() => {
                    clearTypeahead();
                }, 400);

                const matchedItem = items.find((item, index) => {
                    if (index <= focusedIndex) {
                        return false;
                    }

                    return item.textValue
                        .trim()
                        .toLowerCase()
                        .startsWith(search);
                });

                if (matchedItem) {
                    event.preventDefault();
                    focusSelectItem(matchedItem);
                    return;
                }

                const wrappedMatch = items.find((item, index) => {
                    if (index > focusedIndex) {
                        return false;
                    }

                    return item.textValue
                        .trim()
                        .toLowerCase()
                        .startsWith(search);
                });

                if (wrappedMatch) {
                    event.preventDefault();
                    focusSelectItem(wrappedMatch);
                }
            }
        };

        const referenceWidth =
            select.select.refs.reference.current?.offsetWidth;

        const dropdownContent = (
            <Transition
                transition="fade"
                duration={150}
                mounted={select.select.opened}
                {...select.transitionProps}
            >
                <div
                    ref={useMergeRefs([ref, select.select.refs.setFloating])}
                    id={select.listId}
                    role="listbox"
                    aria-labelledby={select.triggerId}
                    tabIndex={-1}
                    style={{
                        ...select.select.floatingStyles,
                        width: referenceWidth,
                        ...style
                    }}
                    className={cx(
                        "z-50 min-w-32 bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] shadow-md border border-[var(--refraktor-border)]",
                        getRadius(select.radius),
                        select.getStyles("dropdown"),
                        className
                    )}
                    {...select.select.getFloatingProps({
                        onKeyDown: handleKeyDown
                    })}
                    {...props}
                >
                    {select.searchable && (
                        <div
                            className={cx(
                                "p-1 border-b border-[var(--refraktor-border)]",
                                select.getStyles("search")
                            )}
                        >
                            <InputField
                                ref={(node) => {
                                    select.searchInputRef.current = node;
                                }}
                                value={select.search}
                                onChange={(event) => {
                                    select.setSearch(event.currentTarget.value);
                                }}
                                size={select.size}
                                radius={select.radius}
                                variant={select.variant}
                                placeholder={select.searchPlaceholder}
                                autoComplete="off"
                                className={select.getStyles("searchInput")}
                            />
                        </div>
                    )}

                    <div
                        className={cx(
                            "max-h-80 overflow-y-auto refraktor-scrollbar p-1",
                            select.getStyles("options")
                        )}
                    >
                        {children}

                        {!select.hasVisibleItems() && (
                            <div
                                className={cx(
                                    "px-1.5 py-1.5 text-sm text-[var(--refraktor-text-secondary)]",
                                    select.getStyles("empty")
                                )}
                            >
                                {select.nothingFound}
                            </div>
                        )}
                    </div>
                </div>
            </Transition>
        );

        const wrappedContent = select.select.opened ? (
            <FloatingFocusManager
                context={select.select.context}
                modal={false}
                initialFocus={-1}
            >
                {dropdownContent}
            </FloatingFocusManager>
        ) : (
            dropdownContent
        );

        return select.withinPortal ? (
            <FloatingPortal>{wrappedContent}</FloatingPortal>
        ) : (
            wrappedContent
        );
    }
);

SelectDropdown.displayName = "@refraktor/core/Select.Dropdown";

export default SelectDropdown;
