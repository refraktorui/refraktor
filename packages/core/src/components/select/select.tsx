import {
    createClassNamesConfig,
    createComponentConfig,
    factory
} from "../../utils";
import { SelectDropdown } from "./select-dropdown";
import { SelectGroup } from "./select-group";
import { SelectItem } from "./select-item";
import { SelectRoot } from "./select-root";
import { SelectTrigger } from "./select-trigger";
import type {
    SelectClassNames,
    SelectData,
    SelectFactoryPayload,
    SelectGroupData,
    SelectProps
} from "./select.types";

function isGroupData(item: SelectData): item is SelectGroupData {
    return "items" in item;
}

const Select = factory<SelectFactoryPayload>((_props, ref) => {
    const { data, children, ...props } = _props;

    if (children !== undefined && children !== null) {
        return (
            <SelectRoot ref={ref} {...props}>
                {children}
            </SelectRoot>
        );
    }

    return (
        <SelectRoot ref={ref} {...props}>
            <SelectTrigger />

            <SelectDropdown>
                {(data ?? []).map((entry, index) => {
                    if (isGroupData(entry)) {
                        return (
                            <SelectGroup key={`group-${index}`} label={entry.label}>
                                {entry.items.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                        disabled={item.disabled}
                                        textValue={item.textValue}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        );
                    }

                    return (
                        <SelectItem
                            key={entry.value}
                            value={entry.value}
                            disabled={entry.disabled}
                            textValue={entry.textValue}
                        >
                            {entry.label}
                        </SelectItem>
                    );
                })}
            </SelectDropdown>
        </SelectRoot>
    );
});

Select.displayName = "@refraktor/core/Select";
Select.configure = createComponentConfig<SelectProps>();
Select.classNames = createClassNamesConfig<SelectClassNames>();
Select.Root = SelectRoot;
Select.Trigger = SelectTrigger;
Select.Dropdown = SelectDropdown;
Select.Group = SelectGroup;
Select.Item = SelectItem;

export default Select;
