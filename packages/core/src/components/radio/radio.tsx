import { useRef } from "react";
import { useId, useMergedRefs, useUncontrolled } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { RadioGroup } from "./radio-group";
import { useRadioGroupContext } from "./radio.context";
import {
    RadioClassNames,
    RadioFactoryPayload,
    RadioProps
} from "./radio.types";
import { getSize } from "./radio.styles";

const defaultProps = {
    labelPosition: "right"
} satisfies Partial<RadioProps>;

const Radio = factory<RadioFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        checked,
        defaultChecked,
        onChange,
        value,
        name,
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
    } = useProps("Radio", defaultProps, _props);
    const classes = useClassNames("Radio", classNames);
    const groupContext = useRadioGroupContext();

    const [uncontrolledValue, handleChange] = useUncontrolled({
        value: checked,
        defaultValue: defaultChecked,
        finalValue: false
    });

    const _id = useId(id);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);

    const hasGroupValue = !!groupContext && typeof value === "string";
    const isChecked = hasGroupValue
        ? groupContext.value === value
        : uncontrolledValue;
    const isDisabled = !!(disabled || groupContext?.disabled);

    const resolvedName = name ?? groupContext?.name;
    const resolvedSize = size ?? groupContext?.size ?? "md";
    const resolvedRadius = radius ?? groupContext?.radius ?? "full";
    const sizeClass = getSize(resolvedSize);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextChecked = event.currentTarget.checked;

        if (hasGroupValue && nextChecked) {
            groupContext.onValueChange(value);
        } else {
            handleChange(nextChecked);
        }

        onChange?.(event);
    };

    return (
        <div className={cx("inline-flex flex-col", classes.root, className)}>
            <label
                className={cx(
                    "inline-flex items-center select-none w-fit",
                    sizeClass.gap,
                    isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer",
                    labelPosition === "left" ? "flex-row-reverse" : "flex-row",
                    classes.body
                )}
                htmlFor={_id}
            >
                <input
                    {...props}
                    id={_id}
                    ref={mergedRef}
                    type="radio"
                    value={value}
                    name={resolvedName}
                    className={cx("sr-only peer", classes.input)}
                    checked={!!isChecked}
                    onChange={handleOnChange}
                    disabled={isDisabled}
                />

                <span
                    className={cx(
                        "relative inline-flex items-center justify-center shrink-0 border transition-all",
                        "bg-[var(--refraktor-bg)] border-[var(--refraktor-border)]",
                        "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--refraktor-primary)]",
                        "data-[checked=true]:bg-[var(--refraktor-primary)] data-[checked=true]:border-[var(--refraktor-primary)]",
                        sizeClass.indicator,
                        getRadius(resolvedRadius),
                        classes.indicator
                    )}
                    data-checked={isChecked}
                >
                    <span
                        className={cx(
                            "rounded-full bg-[var(--refraktor-primary-text)] transition-transform scale-0 data-[checked=true]:scale-100",
                            sizeClass.dot,
                            classes.dot
                        )}
                        data-checked={isChecked}
                    />
                </span>

                {label && (
                    <span
                        className={cx(
                            "text-[var(--refraktor-text)]",
                            sizeClass.label,
                            classes.label
                        )}
                    >
                        {label}
                    </span>
                )}
            </label>

            {description && (
                <p
                    className={cx(
                        "text-[var(--refraktor-text-tertiary)] mt-1",
                        sizeClass.description,
                        classes.description
                    )}
                >
                    {description}
                </p>
            )}

            {error && error !== true && (
                <p
                    className={cx(
                        "text-[var(--refraktor-colors-red-5)] mt-1 text-xs",
                        classes.error
                    )}
                >
                    {error}
                </p>
            )}
        </div>
    );
});

Radio.displayName = "@refraktor/core/Radio";
Radio.configure = createComponentConfig<RadioProps>();
Radio.classNames = createClassNamesConfig<RadioClassNames>();
Radio.Group = RadioGroup;

export default Radio;
