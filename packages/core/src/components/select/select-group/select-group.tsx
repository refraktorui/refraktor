import { useId } from "@refraktor/utils";
import { useTheme } from "../../../theme";
import { factory } from "../../../utils";
import { SelectGroupProvider, useSelectContext } from "../select.context";
import type { SelectGroupFactoryPayload } from "../select.types";

const SelectGroup = factory<SelectGroupFactoryPayload>(
    ({ id, label, children, className, ...props }, ref) => {
        const { cx } = useTheme();
        const select = useSelectContext();

        const _id = useId(id);
        const labelId = `${_id}-label`;
        const isVisible = select.isGroupVisible(_id);

        return (
            <SelectGroupProvider value={{ groupId: _id }}>
                <div
                    ref={ref}
                    role="group"
                    aria-labelledby={label ? labelId : undefined}
                    hidden={!isVisible}
                    className={cx("py-1", select.getStyles("group"), className)}
                    {...props}
                >
                    {label && (
                        <div
                            id={labelId}
                            className={cx(
                                "px-1.5 pb-1 text-xs font-medium text-[var(--refraktor-text-secondary)]",
                                select.getStyles("groupLabel")
                            )}
                        >
                            {label}
                        </div>
                    )}

                    {children}
                </div>
            </SelectGroupProvider>
        );
    }
);

SelectGroup.displayName = "@refraktor/core/Select.Group";

export default SelectGroup;
