import { useId, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../../utils";
import { ChipGroupProvider } from "../chip.context";
import {
    ChipGroupClassNames,
    ChipGroupFactoryPayload,
    ChipGroupProps
} from "../chip.types";

const defaultProps = {
    orientation: "horizontal"
} satisfies Partial<ChipGroupProps>;

const ChipGroup = factory<ChipGroupFactoryPayload>((_props, ref) => {
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
        variant,
        orientation,
        className,
        classNames,
        ...props
    } = useProps("ChipGroup", defaultProps, _props);
    const classes = useClassNames<ChipGroupClassNames>("ChipGroup", classNames);

    const _id = useId(id);

    const [values, setValues] = useUncontrolled<string[]>({
        value,
        defaultValue,
        finalValue: [],
        onChange
    });

    const handleValueChange = (chipValue: string, selected: boolean) => {
        const nextValues = selected
            ? values.includes(chipValue)
                ? values
                : [...values, chipValue]
            : values.filter((itemValue) => itemValue !== chipValue);

        setValues(nextValues);
    };

    return (
        <ChipGroupProvider
            value={{
                value: values,
                onValueChange: handleValueChange,
                disabled,
                size,
                radius,
                variant
            }}
        >
            <div
                ref={ref}
                id={_id}
                data-disabled={disabled}
                aria-disabled={disabled}
                className={cx(
                    "inline-flex",
                    orientation === "vertical"
                        ? "flex-col items-start gap-2"
                        : "flex-row flex-wrap items-center gap-2",
                    "data-[disabled=true]:opacity-50",
                    classes.root,
                    className
                )}
                {...props}
            >
                {children}

                {name &&
                    values.map((itemValue, index) => (
                        <input
                            key={`${itemValue}-${index}`}
                            type="hidden"
                            name={name}
                            value={itemValue}
                        />
                    ))}
            </div>
        </ChipGroupProvider>
    );
});

ChipGroup.displayName = "@refraktor/core/ChipGroup";
ChipGroup.configure = createComponentConfig<ChipGroupProps>();
ChipGroup.classNames = createClassNamesConfig<ChipGroupClassNames>();

export default ChipGroup;
