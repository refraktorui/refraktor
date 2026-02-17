import { ChevronIcon } from "../../../icons";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { InputField } from "../../input/input-field";
import { useSelectContext } from "../select.context";
import type { SelectTriggerFactoryPayload } from "../select.types";

const SelectTrigger = factory<SelectTriggerFactoryPayload>(
    ({ className, placeholder, rightSection, onKeyDown, ...props }, ref) => {
        const { cx } = useTheme();
        const select = useSelectContext();

        const hasValue = !!select.value;
        const selectedLabel = select.getSelectedLabel();

        return (
            <div
                ref={(node) => {
                    select.select.refs.setReference(node);

                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                className={cx("w-full", select.getStyles("trigger"), className)}
                data-opened={select.select.opened}
                {...select.select.getReferenceProps({
                    onKeyDown: (event: React.KeyboardEvent) => {
                        onKeyDown?.(event as any);

                        if (event.defaultPrevented || select.disabled) {
                            return;
                        }

                        if (event.key === "ArrowDown") {
                            event.preventDefault();

                            if (!select.select.opened) {
                                select.select.open();
                            }

                            requestAnimationFrame(select.focusFirstItem);
                            return;
                        }

                        if (event.key === "ArrowUp") {
                            event.preventDefault();

                            if (!select.select.opened) {
                                select.select.open();
                            }

                            requestAnimationFrame(select.focusLastItem);
                            return;
                        }

                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();

                            if (!select.select.opened) {
                                select.select.open();
                            } else {
                                select.select.close();
                            }
                            return;
                        }

                        if (event.key === "Escape" && select.select.opened) {
                            event.preventDefault();
                            select.select.close();
                        }
                    }
                })}
                {...props}
            >
                <InputField
                    id={select.triggerId}
                    ref={(node) => {
                        select.triggerInputRef.current = node;
                    }}
                    readOnly
                    required={select.required}
                    error={select.error}
                    disabled={select.disabled}
                    value={hasValue ? selectedLabel : ""}
                    placeholder={hasValue ? undefined : placeholder ?? select.placeholder}
                    size={select.size}
                    radius={select.radius}
                    variant={select.variant}
                    role="combobox"
                    aria-expanded={select.select.opened}
                    aria-controls={select.listId}
                    aria-haspopup="listbox"
                    aria-autocomplete={select.searchable ? "list" : "none"}
                    aria-disabled={select.disabled}
                    className={cx(
                        "cursor-pointer",
                        select.getStyles("triggerInput")
                    )}
                    rightSection={
                        rightSection ?? (
                            <ChevronIcon
                                direction="down"
                                size={14}
                                className={cx(
                                    "transition-transform",
                                    select.select.opened && "rotate-180",
                                    select.getStyles("triggerIcon")
                                )}
                            />
                        )
                    }
                />
            </div>
        );
    }
);

SelectTrigger.displayName = "@refraktor/core/Select.Trigger";

export default SelectTrigger;
