import { useId, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../../utils";
import { CheckboxGroupProvider } from "../checkbox.context";
import {
    CheckboxGroupClassNames,
    CheckboxGroupFactoryPayload,
    CheckboxGroupProps
} from "../checkbox.types";

const defaultProps = {
    orientation: "vertical"
} satisfies Partial<CheckboxGroupProps>;

const CheckboxGroup = factory<CheckboxGroupFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        id,
        children,
        value,
        defaultValue,
        onChange,
        name,
        disabled,
        size,
        radius,
        orientation,
        className,
        classNames,
        ...props
    } = useProps("CheckboxGroup", defaultProps, _props);
    const classes = useClassNames("CheckboxGroup", classNames);

    const _id = useId(id);

    const [values, setValues] = useUncontrolled<string[]>({
        value,
        defaultValue,
        finalValue: [],
        onChange
    });

    const handleValueChange = (checkboxValue: string, checked: boolean) => {
        const nextValues = checked
            ? values.includes(checkboxValue)
                ? values
                : [...values, checkboxValue]
            : values.filter((itemValue) => itemValue !== checkboxValue);

        setValues(nextValues);
    };

    return (
        <CheckboxGroupProvider
            value={{
                value: values,
                onValueChange: handleValueChange,
                name,
                disabled,
                size,
                radius
            }}
        >
            <div
                ref={ref}
                id={_id}
                className={cx(
                    "inline-flex",
                    orientation === "horizontal"
                        ? "flex-row flex-wrap gap-3"
                        : "flex-col gap-2",
                    classes.root,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </CheckboxGroupProvider>
    );
});

CheckboxGroup.displayName = "@refraktor/core/CheckboxGroup";
CheckboxGroup.configure = createComponentConfig<CheckboxGroupProps>();
CheckboxGroup.classNames = createClassNamesConfig<CheckboxGroupClassNames>();

export default CheckboxGroup;
