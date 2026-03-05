import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../../utils";
import { useId } from "@refraktor/utils";
import {
    InputFieldClassNames,
    InputFieldFactoryPayload,
    InputFieldProps
} from "../input.types";
import { getSize, getVariant } from "./input-field.styles";
import { useTheme } from "../../../theme";

const defaultProps = {
    variant: "default",
    size: "md",
    radius: "default"
} satisfies Partial<InputFieldProps>;

const InputField = factory<InputFieldFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        variant,
        size,
        radius,
        error,
        leftSection,
        rightSection,
        className,
        classNames,
        style,
        disabled,
        ...props
    } = useProps("InputField", defaultProps, _props);
    const classes = useClassNames<InputFieldClassNames>("InputField", classNames);

    const _id = useId(id);

    return (
        <div
            className={cx(
                "relative w-full grid items-center transition-all",
                leftSection && rightSection && "grid-cols-[auto_1fr_auto]",
                leftSection && !rightSection && "grid-cols-[auto_1fr]",
                !leftSection && rightSection && "grid-cols-[1fr_auto]",
                !leftSection && !rightSection && "grid-cols-[1fr]",
                (leftSection || rightSection) && "gap-2",
                getSize(size),
                getVariant(variant),
                getRadius(radius),
                "focus-within:border-[var(--refraktor-primary)]",
                error && "border-[var(--refraktor-colors-red-6)]",
                disabled && "opacity-50 cursor-not-allowed",
                classes.root,
                className
            )}
            style={style}
        >
            {leftSection && (
                <div
                    className={cx(
                        "flex h-full self-stretch items-center justify-center text-[var(--refraktor-text-secondary)] shrink-0 select-none",
                        classes.leftSection
                    )}
                >
                    {leftSection}
                </div>
            )}

            <input
                id={_id}
                ref={ref}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                className={cx(
                    "w-full h-full outline-none border-none bg-transparent p-0",
                    "text-[var(--refraktor-text)]",
                    "placeholder:text-[var(--refraktor-text-tertiary)]",
                    disabled && "cursor-not-allowed"
                )}
                {...props}
            />

            {rightSection && (
                <div
                    className={cx(
                        "flex h-full self-stretch items-center justify-center text-[var(--refraktor-text-secondary)] shrink-0 select-none",
                        classes.rightSection
                    )}
                >
                    {rightSection}
                </div>
            )}
        </div>
    );
});

InputField.displayName = "@refraktor/core/InputField";
InputField.configure = createComponentConfig<InputFieldProps>();
InputField.classNames = createClassNamesConfig<InputFieldClassNames>();

export default InputField;
