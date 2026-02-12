import { useId } from "@refraktor/utils";
import { useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { ChevronIcon } from "../../../icons";
import { MenuSubTriggerFactoryPayload } from "../menu.types";
import {
    getNodeTextValue,
    useMenuRootContext,
    useMenuSubContext
} from "../menu.context";

const MenuSubTrigger = factory<MenuSubTriggerFactoryPayload>(
    (
        {
            id,
            children,
            className,
            disabled,
            textValue,
            leftSection,
            rightSection,
            onClick,
            onMouseMove,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const { cx } = useTheme();
        const { getStyles } = useMenuRootContext();
        const { submenuLevel, parentLevel, disabled: parentDisabled, openSubmenu } =
            useMenuSubContext();

        const isDisabled = !!disabled || parentDisabled;
        const _id = useId(id);
        const itemRef = useRef<HTMLButtonElement | null>(null);
        const resolvedTextValue = getNodeTextValue(children, textValue);

        useEffect(() => {
            return parentLevel.registerItem({
                id: _id,
                ref: itemRef as React.MutableRefObject<HTMLElement | null>,
                disabled: isDisabled,
                textValue: resolvedTextValue,
                hasSubmenu: true,
                openSubmenu: (focusFirstItem?: boolean) => {
                    openSubmenu(focusFirstItem);
                }
            });
        }, [parentLevel, _id, isDisabled, resolvedTextValue, openSubmenu]);

        return (
            <button
                ref={(node) => {
                    itemRef.current = node;
                    submenuLevel.menu.refs.setReference(node);

                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={isDisabled}
                data-disabled={isDisabled}
                data-opened={submenuLevel.menu.opened}
                aria-disabled={isDisabled}
                aria-haspopup="menu"
                aria-expanded={submenuLevel.menu.opened}
                className={cx(
                    "w-full text-left px-2 py-1.5 text-sm rounded-sm",
                    "inline-flex items-center gap-2 outline-none transition-colors",
                    "hover:bg-[var(--refraktor-bg-hover)] focus-visible:bg-[var(--refraktor-bg-hover)]",
                    "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    getStyles("item"),
                    getStyles("subTrigger"),
                    className
                )}
                {...submenuLevel.menu.getReferenceProps({
                    onMouseMove: (event) => {
                        onMouseMove?.(event as any);

                        if (isDisabled) {
                            return;
                        }

                        if (document.activeElement !== event.currentTarget) {
                            event.currentTarget.focus();
                        }

                        openSubmenu(false);
                    },
                    onClick: (event) => {
                        onClick?.(event as any);

                        if (event.defaultPrevented || isDisabled) {
                            return;
                        }

                        submenuLevel.menu.toggle();
                    },
                    onKeyDown: (event) => {
                        onKeyDown?.(event as any);

                        if (event.defaultPrevented || isDisabled) {
                            return;
                        }

                        if (
                            event.key === "ArrowRight" ||
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();
                            openSubmenu(true);
                        }
                    }
                })}
                {...props}
            >
                {leftSection && (
                    <span
                        className={cx(
                            "inline-flex items-center shrink-0",
                            getStyles("itemLeftSection")
                        )}
                    >
                        {leftSection}
                    </span>
                )}

                <span className="flex-1">{children}</span>

                {rightSection && (
                    <span
                        className={cx(
                            "inline-flex items-center shrink-0 text-[var(--refraktor-text-secondary)]",
                            getStyles("itemRightSection")
                        )}
                    >
                        {rightSection}
                    </span>
                )}

                <span
                    className={cx(
                        "inline-flex items-center shrink-0 text-[var(--refraktor-text-secondary)]",
                        getStyles("subIndicator")
                    )}
                >
                    <ChevronIcon direction="right" size={14} />
                </span>
            </button>
        );
    }
);

MenuSubTrigger.displayName = "@refraktor/core/Menu.SubTrigger";

export default MenuSubTrigger;
