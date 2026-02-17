import { useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { MenuSubDropdownFactoryPayload } from "../menu.types";
import {
    findFocusedMenuItemIndex,
    findTypeaheadMatch,
    focusMenuItem,
    getNavigableMenuItems,
    MenuLevelProvider,
    useMenuRootContext,
    useMenuSubContext
} from "../menu.context";
import { Transition } from "../../transition";
import {
    FloatingFocusManager,
    FloatingPortal,
    useMergeRefs
} from "@floating-ui/react";

const MenuSubDropdown = factory<MenuSubDropdownFactoryPayload>(
    ({ children, className, style, ...props }, ref) => {
        const { cx, getRadius } = useTheme();
        const { radius, withinPortal, transitionProps, getStyles } =
            useMenuRootContext();
        const { submenuLevel } = useMenuSubContext();

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
            const items = getNavigableMenuItems(submenuLevel.getItems());
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

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                submenuLevel.closeMenu();
                submenuLevel.menu.refs.reference.current?.focus();
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                submenuLevel.closeMenu();
                submenuLevel.menu.refs.reference.current?.focus();
                return;
            }

            if (event.key === "Tab") {
                submenuLevel.closeAllMenus();
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
                mounted={submenuLevel.menu.opened}
                style={{ position: "relative", zIndex: 1000 }}
                {...transitionProps}
            >
                <MenuLevelProvider value={submenuLevel}>
                    <div
                        ref={useMergeRefs([
                            ref,
                            submenuLevel.menu.refs.setFloating
                        ])}
                        role="menu"
                        tabIndex={-1}
                        style={{
                            ...submenuLevel.menu.floatingStyles,
                            zIndex: 1000,
                            scrollbarGutter: "auto",
                            ...style
                        }}
                        className={cx(
                            "z-50 min-w-32 max-h-80 overflow-y-auto refraktor-scrollbar",
                            "p-1 bg-[var(--refraktor-bg)] text-[var(--refraktor-text)] shadow-md border border-[var(--refraktor-border)]",
                            getRadius(radius),
                            getStyles("dropdown"),
                            getStyles("subDropdown"),
                            className
                        )}
                        {...submenuLevel.menu.getFloatingProps({
                            onKeyDown: handleKeyDown
                        })}
                        {...props}
                    >
                        {children}
                    </div>
                </MenuLevelProvider>
            </Transition>
        );

        const wrappedContent = submenuLevel.menu.opened ? (
            <FloatingFocusManager
                context={submenuLevel.menu.context}
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

MenuSubDropdown.displayName = "@refraktor/core/Menu.SubDropdown";

export default MenuSubDropdown;
