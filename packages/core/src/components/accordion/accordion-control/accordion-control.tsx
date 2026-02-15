import { ChevronIcon } from "../../../icons";
import { useMergedRefs } from "@refraktor/utils";
import { MutableRefObject, useEffect, useRef } from "react";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import {
    getNavigableAccordionItems,
    useAccordionContext,
    useAccordionItemContext
} from "../accordion.context";
import { getSize, getVariant } from "../accordion.styles";
import { AccordionControlFactoryPayload } from "../accordion.types";

const AccordionControl = factory<AccordionControlFactoryPayload>(
    ({ children, chevron, className, onClick, onKeyDown, ...props }, ref) => {
        const { cx } = useTheme();
        const {
            size,
            variant,
            isItemOpen,
            toggleItem,
            registerItem,
            getItems,
            getControlId,
            getPanelId,
            getStyles
        } = useAccordionContext();
        const item = useAccordionItemContext();

        const localRef = useRef<HTMLButtonElement>(null);
        const mergedRef = useMergedRefs(ref, localRef);

        useEffect(() => {
            return registerItem({
                value: item.value,
                ref: localRef as MutableRefObject<HTMLElement | null>,
                disabled: item.disabled
            });
        }, [item.value, item.disabled, registerItem]);

        const isOpen = isItemOpen(item.value);
        const sizeStyles = getSize(size);
        const variantStyles = getVariant(variant);

        const moveFocus = (direction: -1 | 1) => {
            const items = getNavigableAccordionItems(getItems());

            if (!items.length) {
                return;
            }

            const currentIndex = items.findIndex((x) => x.value === item.value);

            if (currentIndex === -1) {
                return;
            }

            const nextIndex =
                (currentIndex + direction + items.length) % items.length;

            items[nextIndex].ref.current?.focus();
        };

        const focusBoundary = (type: "first" | "last") => {
            const items = getNavigableAccordionItems(getItems());

            if (!items.length) {
                return;
            }

            const target = type === "first" ? items[0] : items[items.length - 1];

            target.ref.current?.focus();
        };

        return (
            <button
                ref={mergedRef}
                id={getControlId(item.value)}
                type="button"
                aria-expanded={isOpen}
                aria-controls={getPanelId(item.value)}
                disabled={item.disabled}
                data-opened={isOpen}
                data-disabled={item.disabled}
                className={cx(
                    "w-full inline-flex items-center justify-between gap-2 text-left select-none outline-none transition-colors cursor-pointer",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--refraktor-primary)]",
                    "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    "text-[var(--refraktor-text)]",
                    sizeStyles.control,
                    variantStyles.control,
                    getStyles("control"),
                    className
                )}
                onClick={(event) => {
                    onClick?.(event);

                    if (event.defaultPrevented || item.disabled) {
                        return;
                    }

                    toggleItem(item.value);
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event);

                    if (event.defaultPrevented || item.disabled) {
                        return;
                    }

                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        moveFocus(1);
                        return;
                    }

                    if (event.key === "ArrowUp") {
                        event.preventDefault();
                        moveFocus(-1);
                        return;
                    }

                    if (event.key === "Home") {
                        event.preventDefault();
                        focusBoundary("first");
                        return;
                    }

                    if (event.key === "End") {
                        event.preventDefault();
                        focusBoundary("last");
                    }
                }}
                {...props}
            >
                <span>{children}</span>

                <span
                    className={cx(
                        "shrink-0 transition-transform",
                        sizeStyles.chevron,
                        isOpen && "rotate-180",
                        getStyles("chevron")
                    )}
                >
                    {chevron ?? <ChevronIcon direction="down" size="100%" />}
                </span>
            </button>
        );
    }
);

AccordionControl.displayName = "@refraktor/core/Accordion.Control";

export default AccordionControl;
