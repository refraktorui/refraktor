import { useId } from "@refraktor/utils";
import { useCallback, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { CheckIcon } from "../../../icons";
import { getRadius, useTheme } from "../../../theme";
import { factory } from "../../../utils";
import {
    getNodeTextValue,
    useSelectContext,
    useSelectGroupContext
} from "../select.context";
import type { SelectItemFactoryPayload } from "../select.types";

const SelectItem = factory<SelectItemFactoryPayload>(
    (
        {
            id,
            value,
            children,
            disabled,
            textValue,
            className,
            onClick,
            onMouseMove,
            onKeyDown,
            onSelect,
            ...props
        },
        ref
    ) => {
        const { cx } = useTheme();
        const select = useSelectContext();
        const group = useSelectGroupContext();

        const _id = useId(id);
        const itemRef = useRef<HTMLButtonElement | null>(null);

        const resolvedTextValue =
            getNodeTextValue(children, textValue) || value;
        const isVisible = select.isSearchMatch(resolvedTextValue);
        const isSelected = select.value === value;

        const handleSelect = useCallback(() => {
            if (disabled) {
                return;
            }

            select.selectValue(value, resolvedTextValue);
            onSelect?.(value);
        }, [disabled, onSelect, resolvedTextValue, select.selectValue, value]);

        useEffect(() => {
            return select.registerItem({
                id: _id,
                value,
                ref: itemRef as MutableRefObject<HTMLElement | null>,
                disabled: !!disabled,
                label: resolvedTextValue,
                textValue: resolvedTextValue,
                groupId: group?.groupId,
                select: handleSelect
            });
        }, [
            _id,
            disabled,
            group?.groupId,
            handleSelect,
            resolvedTextValue,
            select.registerItem,
            value
        ]);

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
                id={_id}
                type="button"
                role="option"
                tabIndex={-1}
                disabled={disabled}
                hidden={!isVisible}
                data-selected={isSelected}
                data-disabled={disabled}
                aria-selected={isSelected}
                aria-disabled={disabled}
                className={cx(
                    "w-full text-left p-1.5 text-sm rounded-none appearance-none border-none bg-transparent",
                    "inline-flex items-center gap-2 outline-none transition-colors",
                    "hover:bg-[var(--refraktor-bg-hover)] focus-visible:bg-[var(--refraktor-bg-hover)]",
                    "data-[selected=true]:bg-[var(--refraktor-bg-hover)]",
                    "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    getRadius(select.radius),
                    select.getStyles("item"),
                    className
                )}
                onMouseMove={(event) => {
                    onMouseMove?.(event);

                    if (
                        !disabled &&
                        document.activeElement !== event.currentTarget
                    ) {
                        event.currentTarget.focus();
                    }
                }}
                onClick={(event) => {
                    onClick?.(event);

                    if (event.defaultPrevented) {
                        return;
                    }

                    handleSelect();
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event);

                    if (event.defaultPrevented || disabled) {
                        return;
                    }

                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelect();
                    }
                }}
                {...props}
            >
                <span className={cx("flex-1", select.getStyles("itemLabel"))}>
                    {children}
                </span>

                {isSelected && (
                    <span
                        className={cx(
                            "inline-flex items-center shrink-0 text-[var(--refraktor-primary)]",
                            select.getStyles("itemCheck")
                        )}
                    >
                        <CheckIcon size={14} />
                    </span>
                )}
            </button>
        );
    }
);

SelectItem.displayName = "@refraktor/core/Select.Item";

export default SelectItem;
