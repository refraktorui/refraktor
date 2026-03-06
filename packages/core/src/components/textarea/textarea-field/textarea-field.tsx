import {
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../../utils";
import { useId } from "@refraktor/utils";
import {
    TextareaFieldClassNames,
    TextareaFieldFactoryPayload,
    TextareaFieldProps
} from "../textarea.types";
import { getSize, getVariant, getResize } from "./textarea-field.styles";
import { useTheme } from "../../../theme";
import TextareaAutosize from "react-textarea-autosize";

const defaultProps = {
    variant: "default",
    size: "md",
    radius: "default",
    autosize: false,
    minRows: 2
} satisfies Partial<TextareaFieldProps>;

const TextareaField = factory<TextareaFieldFactoryPayload>((_props, ref) => {
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
        autosize,
        minRows,
        maxRows,
        resize,
        rows,
        ...props
    } = useProps("TextareaField", defaultProps, _props);
    const classes = useClassNames<TextareaFieldClassNames>(
        "TextareaField",
        classNames
    );

    const _id = useId(id);

    const resolvedResize = resize ?? (autosize ? "none" : "vertical");

    const textareaClassName = cx(
        "w-full outline-none border-none bg-transparent p-0",
        "text-[var(--refraktor-text)]",
        "placeholder:text-[var(--refraktor-text-tertiary)]",
        getResize(resolvedResize),
        disabled && "cursor-not-allowed"
    );

    const wrapperClassName = cx(
        "relative w-full grid transition-all refraktor-scrollbar",
        leftSection && rightSection && "grid-cols-[auto_1fr_auto]",
        leftSection && !rightSection && "grid-cols-[auto_1fr]",
        !leftSection && rightSection && "grid-cols-[1fr_auto]",
        !leftSection && !rightSection && "grid-cols-[1fr]",
        (leftSection || rightSection) && "gap-2 items-center",
        getSize(size),
        getVariant(variant),
        getRadius(radius),
        "focus-within:border-[var(--refraktor-primary)]",
        error && "border-[var(--refraktor-colors-red-6)]",
        disabled && "opacity-50 cursor-not-allowed",
        classes.root,
        className
    );

    if (autosize) {
        return (
            <div className={wrapperClassName} style={style}>
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

                <TextareaAutosize
                    id={_id}
                    ref={ref}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    minRows={minRows}
                    maxRows={maxRows}
                    className={textareaClassName}
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
    }

    return (
        <div className={wrapperClassName} style={style}>
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

            <textarea
                id={_id}
                ref={ref}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                rows={rows ?? minRows}
                className={textareaClassName}
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

TextareaField.displayName = "@refraktor/core/TextareaField";
TextareaField.configure = createComponentConfig<TextareaFieldProps>();

export default TextareaField;
