import { useId } from "@refraktor/utils";
import { useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { MenuItemFactoryPayload } from "../menu.types";
import {
    getNodeTextValue,
    useMenuLevelContext,
    useMenuRootContext
} from "../menu.context";

const MenuItem = factory<MenuItemFactoryPayload>(
    (
        {
            id,
            children,
            className,
            onSelect,
            onClick,
            onMouseMove,
            disabled,
            closeOnSelect,
            textValue,
            leftSection,
            rightSection,
            ...props
        },
        ref
    ) => {
        const { cx } = useTheme();
        const { closeOnItemClick, getStyles } = useMenuRootContext();
        const level = useMenuLevelContext();

        const _id = useId(id);
        const itemRef = useRef<HTMLButtonElement | null>(null);
        const resolvedTextValue = getNodeTextValue(children, textValue);

        useEffect(() => {
            return level.registerItem({
                id: _id,
                ref: itemRef as React.MutableRefObject<HTMLElement | null>,
                disabled: !!disabled,
                textValue: resolvedTextValue
            });
        }, [level, _id, disabled, resolvedTextValue]);

        return (
            <button
                ref={(node) => {
                    itemRef.current = node;

                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={disabled}
                data-disabled={disabled}
                aria-disabled={disabled}
                className={cx(
                    "w-full text-left px-2 py-1.5 text-sm rounded-sm",
                    "inline-flex items-center gap-2 outline-none transition-colors",
                    "hover:bg-[var(--refraktor-bg-hover)] focus-visible:bg-[var(--refraktor-bg-hover)]",
                    "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    getStyles("item"),
                    className
                )}
                onMouseMove={(event) => {
                    onMouseMove?.(event);

                    if (!disabled && document.activeElement !== event.currentTarget) {
                        event.currentTarget.focus();
                    }
                }}
                onClick={(event) => {
                    onClick?.(event);

                    if (event.defaultPrevented || disabled) {
                        return;
                    }

                    onSelect?.();

                    const shouldClose = closeOnSelect ?? closeOnItemClick;

                    if (shouldClose) {
                        level.closeAllMenus();
                    }
                }}
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
            </button>
        );
    }
);

MenuItem.displayName = "@refraktor/core/Menu.Item";

export default MenuItem;
