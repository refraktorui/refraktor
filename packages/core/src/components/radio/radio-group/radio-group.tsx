import { useId, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../../utils";
import { RadioGroupProvider } from "../radio.context";
import {
    RadioGroupClassNames,
    RadioGroupFactoryPayload,
    RadioGroupProps
} from "../radio.types";

const defaultProps = {
    orientation: "vertical"
} satisfies Partial<RadioGroupProps>;

const RadioGroup = factory<RadioGroupFactoryPayload>((_props, ref) => {
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
    } = useProps("RadioGroup", defaultProps, _props);
    const classes = useClassNames("RadioGroup", classNames);

    const _id = useId(id);

    const [selectedValue, setSelectedValue] = useUncontrolled<string>({
        value,
        defaultValue,
        finalValue: "",
        onChange
    });

    const handleValueChange = (radioValue: string) => {
        setSelectedValue(radioValue);
    };

    const resolvedName = name ?? _id;

    return (
        <RadioGroupProvider
            value={{
                value: selectedValue,
                onValueChange: handleValueChange,
                name: resolvedName,
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
        </RadioGroupProvider>
    );
});

RadioGroup.displayName = "@refraktor/core/RadioGroup";
RadioGroup.configure = createComponentConfig<RadioGroupProps>();
RadioGroup.classNames = createClassNamesConfig<RadioGroupClassNames>();

export default RadioGroup;
