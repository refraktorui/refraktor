import { useId, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    SwitchClassNames,
    SwitchFactoryPayload,
    SwitchProps
} from "./switch.types";
import { getSize } from "./switch.styles";

const defaultProps = {
    size: "md",
    radius: "full",
    labelPosition: "right"
} satisfies Partial<SwitchProps>;

const Switch = factory<SwitchFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        checked,
        defaultChecked,
        onChange,
        size,
        radius,
        disabled,
        label,
        labelPosition,
        description,
        error,
        className,
        classNames,
        ...props
    } = useProps("Switch", defaultProps, _props);
    const classes = useClassNames("Switch", classNames);

    const [value, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false
    });

    const _id = useId(id);
    const sizeClass = getSize(size);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event.currentTarget.checked);
        onChange?.(event);
    };

    return (
        <div className={cx("inline-flex flex-col", classes.root, className)}>
            <label
                className={cx(
                    "inline-flex items-center cursor-pointer select-none",
                    disabled && "opacity-50 cursor-not-allowed",
                    labelPosition === "left" ? "flex-row-reverse" : "flex-row"
                )}
                htmlFor={_id}
            >
                <input
                    {...props}
                    id={_id}
                    ref={ref}
                    type="checkbox"
                    className={cx("sr-only", classes.input)}
                    checked={value}
                    onChange={handleOnChange}
                    disabled={disabled}
                />

                <div
                    className={cx(
                        "relative bg-[var(--refraktor-bg)] transition-all shrink-0 group",
                        "data-[checked=true]:bg-[var(--refraktor-primary)]",
                        "flex items-center p-0.5",
                        sizeClass.track,
                        getRadius(radius),
                        classes.track
                    )}
                    data-checked={value}
                >
                    <span
                        className={cx(
                            "bg-[var(--refraktor-colors-white)] shadow-sm transition-all pointer-events-none",
                            sizeClass.thumb,
                            getRadius(radius),
                            classes.thumb
                        )}
                    />
                </div>

                {label && (
                    <span
                        className={cx(
                            "text-[var(--refraktor-text)]",
                            labelPosition === "left" ? "mr-3" : "ml-3",
                            sizeClass.label,
                            classes.label
                        )}
                    >
                        {label}
                    </span>
                )}
            </label>

            {description && (
                <p className="text-[var(--refraktor-text-tertiary)] text-xs mt-1">
                    {description}
                </p>
            )}

            {error && error !== true && (
                <p className="text-[var(--refraktor-colors-red-5)] text-xs mt-1">
                    {error}
                </p>
            )}
        </div>
    );
});

Switch.displayName = "@refraktor/core/Switch";
Switch.configure = createComponentConfig<SwitchProps>();
Switch.classNames = createClassNamesConfig<SwitchClassNames>();

export default Switch;
