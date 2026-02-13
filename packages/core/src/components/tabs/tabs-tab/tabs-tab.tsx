import { useMergedRefs } from "@refraktor/utils";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { getNavigableTabs, useTabsContext } from "../tabs.context";
import { getSize, getVariant } from "../tabs.styles";
import { TabsTabFactoryPayload } from "../tabs.types";

const TabsTab = factory<TabsTabFactoryPayload>(
    (
        {
            value,
            disabled,
            children,
            className,
            onClick,
            onFocus,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const { cx, getRadius } = useTheme();
        const {
            value: activeValue,
            onValueChange,
            orientation,
            activationMode,
            loop,
            size,
            radius,
            variant,
            registerTab,
            getTabs,
            getTabId,
            getPanelId,
            getStyles
        } = useTabsContext();

        const localRef = useRef<HTMLButtonElement>(null);
        const mergedRef = useMergedRefs(ref, localRef);

        useEffect(() => {
            return registerTab({
                value,
                ref: localRef as MutableRefObject<HTMLElement | null>,
                disabled: !!disabled
            });
        }, [value, disabled, registerTab]);

        const sizeStyles = getSize(size);
        const variantStyles = getVariant(variant, orientation);
        const isActive = activeValue === value;

        const isTabStop = useMemo(() => {
            const firstEnabledTab = getNavigableTabs(getTabs())[0];

            if (disabled) {
                return false;
            }

            return (
                isActive || (!activeValue && firstEnabledTab?.value === value)
            );
        }, [activeValue, disabled, getTabs, isActive, value]);

        const handleMove = (direction: -1 | 1) => {
            const tabs = getNavigableTabs(getTabs());

            if (!tabs.length) {
                return;
            }

            const currentIndex = tabs.findIndex((tab) => tab.value === value);

            if (currentIndex === -1) {
                return;
            }

            let nextIndex = currentIndex + direction;

            if (loop) {
                nextIndex = (nextIndex + tabs.length) % tabs.length;
            } else {
                nextIndex = Math.min(Math.max(nextIndex, 0), tabs.length - 1);
            }

            if (nextIndex === currentIndex) {
                return;
            }

            const nextTab = tabs[nextIndex];
            nextTab.ref.current?.focus();

            if (activationMode === "automatic") {
                onValueChange(nextTab.value);
            }
        };

        const handleBoundary = (type: "first" | "last") => {
            const tabs = getNavigableTabs(getTabs());

            if (!tabs.length) {
                return;
            }

            const target = type === "first" ? tabs[0] : tabs[tabs.length - 1];

            target.ref.current?.focus();

            if (activationMode === "automatic") {
                onValueChange(target.value);
            }
        };

        return (
            <button
                ref={mergedRef}
                id={getTabId(value)}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={getPanelId(value)}
                aria-disabled={disabled}
                disabled={disabled}
                data-active={isActive}
                data-disabled={disabled}
                tabIndex={isTabStop ? 0 : -1}
                className={cx(
                    "inline-flex items-center justify-center select-none outline-none transition-colors cursor-pointer",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                    "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    sizeStyles.tab,
                    variantStyles.tab,
                    isActive
                        ? variantStyles.tabActive
                        : variantStyles.tabInactive,
                    variant !== "underline" && getRadius(radius),
                    getStyles("tab"),
                    className
                )}
                onClick={(event) => {
                    onClick?.(event);

                    if (event.defaultPrevented || disabled) {
                        return;
                    }

                    onValueChange(value);
                }}
                onFocus={(event) => {
                    onFocus?.(event);

                    if (event.defaultPrevented || disabled) {
                        return;
                    }

                    if (activationMode === "automatic" && !isActive) {
                        onValueChange(value);
                    }
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event);

                    if (event.defaultPrevented || disabled) {
                        return;
                    }

                    const previousKey =
                        orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
                    const nextKey =
                        orientation === "horizontal"
                            ? "ArrowRight"
                            : "ArrowDown";

                    if (event.key === previousKey) {
                        event.preventDefault();
                        handleMove(-1);
                        return;
                    }

                    if (event.key === nextKey) {
                        event.preventDefault();
                        handleMove(1);
                        return;
                    }

                    if (event.key === "Home") {
                        event.preventDefault();
                        handleBoundary("first");
                        return;
                    }

                    if (event.key === "End") {
                        event.preventDefault();
                        handleBoundary("last");
                        return;
                    }

                    if (
                        activationMode === "manual" &&
                        (event.key === "Enter" || event.key === " ")
                    ) {
                        event.preventDefault();
                        onValueChange(value);
                    }
                }}
                {...props}
            >
                {children}
            </button>
        );
    }
);

TabsTab.displayName = "@refraktor/core/Tabs.Tab";

export default TabsTab;
