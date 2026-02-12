import { useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { MenuDropdownFactoryPayload } from "../menu.types";
import {
    findFocusedMenuItemIndex,
    findTypeaheadMatch,
    focusMenuItem,
    getNavigableMenuItems,
    useMenuLevelContext,
    useMenuRootContext
} from "../menu.context";
import { Transition } from "../../transition";
import {
    FloatingFocusManager,
    FloatingPortal,
    useMergeRefs
} from "@floating-ui/react";

const MenuDropdown = factory<MenuDropdownFactoryPayload>(
    ({ children, className, style, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const { radius, withinPortal, transitionProps, getStyles } =
            useMenuRootContext();
        const level = useMenuLevelContext();

        const typeaheadRef = useRef("");
        const typeaheadTimeoutRef = useRef<number | null>(null);

        useEffect(() => {
            return () => {
                if (typeaheadTimeoutRef.current !== null) {
                    window.clearTimeout(typeaheadTimeoutRef.current);
                }
            };
        }, []);

        const clearTypeahead = () => {
            typeaheadRef.current = "";

            if (typeaheadTimeoutRef.current !== null) {
                window.clearTimeout(typeaheadTimeoutRef.current);
                typeaheadTimeoutRef.current = null;
            }
        };

        const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
            const items = getNavigableMenuItems(level.getItems());
            const focusedIndex = findFocusedMenuItemIndex(items);

            if (event.key === "ArrowDown") {
                event.preventDefault();

                if (!items.length) {
                    return;
                }

                const nextIndex =
                    focusedIndex >= 0 ? (focusedIndex + 1) % items.length : 0;

                focusMenuItem(items[nextIndex]);
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

                focusMenuItem(items[nextIndex]);
                return;
            }

            if (event.key === "Home") {
                event.preventDefault();
                focusMenuItem(items[0]);
                return;
            }

            if (event.key === "End") {
                event.preventDefault();
                focusMenuItem(items[items.length - 1]);
                return;
            }

            if (event.key === "ArrowRight") {
                if (focusedIndex < 0) {
                    return;
                }

                const activeItem = items[focusedIndex];

                if (activeItem.hasSubmenu && activeItem.openSubmenu) {
                    event.preventDefault();
                    activeItem.openSubmenu(true);
                }

                return;
            }

            if (event.key === "ArrowLeft" && level.isSubmenu) {
                event.preventDefault();
                level.closeMenu();
                level.menu.refs.reference.current?.focus();
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();

                if (level.isSubmenu) {
                    level.closeMenu();
                    level.menu.refs.reference.current?.focus();
                } else {
                    level.closeAllMenus();
                    level.menu.refs.reference.current?.focus();
                }

                return;
            }

            if (event.key === "Tab") {
                level.closeAllMenus();
                return;
            }

            if (
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

                const matchedIndex = findTypeaheadMatch(
                    items,
                    search,
                    focusedIndex
                );

                if (matchedIndex !== -1) {
                    event.preventDefault();
                    focusMenuItem(items[matchedIndex]);
                }
            }
        };

        const dropdownContent = (
            <Transition
                transition="fade"
                duration={150}
                mounted={level.menu.opened}
                {...transitionProps}
            >
                <div
                    ref={useMergeRefs([ref, level.menu.refs.setFloating])}
                    role="menu"
                    tabIndex={-1}
                    style={{
                        ...level.menu.floatingStyles,
                        scrollbarGutter: "auto",
                        ...style
                    }}
                    className={cx(
                        "z-50 min-w-32 max-h-80 overflow-y-auto refraktor-scrollbar",
                        "p-1 bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] shadow-md border border-[var(--refraktor-border)]",
                        getRadius(radius),
                        getStyles("dropdown"),
                        className
                    )}
                    {...level.menu.getFloatingProps({
                        onKeyDown: handleKeyDown
                    })}
                    {...props}
                >
                    {children}
                </div>
            </Transition>
        );

        const wrappedContent = level.menu.opened ? (
            <FloatingFocusManager
                context={level.menu.context}
                modal={false}
                initialFocus={-1}
            >
                {dropdownContent}
            </FloatingFocusManager>
        ) : (
            dropdownContent
        );

        return withinPortal ? (
            <FloatingPortal>{wrappedContent}</FloatingPortal>
        ) : (
            wrappedContent
        );
    }
);

MenuDropdown.displayName = "@refraktor/core/Menu.Dropdown";

export default MenuDropdown;
