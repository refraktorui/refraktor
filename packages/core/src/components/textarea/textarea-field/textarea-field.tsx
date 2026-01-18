import { createComponentConfig, factory, useProps } from "../../../utils";
import { useId } from "@refraktor/utils";
import {
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
        className,
        style,
        disabled,
        autosize,
        minRows,
        maxRows,
        resize,
        rows,
        ...props
    } = useProps("TextareaField", defaultProps, _props);

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
        "w-full transition-all refraktor-scrollbar",
        getSize(size),
        getVariant(variant),
        getRadius(radius),
        "focus-within:border-[var(--refraktor-primary)]",
        error && "border-[var(--refraktor-colors-red-6)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
    );

    if (autosize) {
        return (
            <div className={wrapperClassName} style={style}>
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
            </div>
        );
    }

    return (
        <div className={wrapperClassName} style={style}>
            <textarea
                id={_id}
                ref={ref}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                rows={rows ?? minRows}
                className={textareaClassName}
                {...props}
            />
        </div>
    );
});

TextareaField.displayName = "@refraktor/core/TextareaField";
TextareaField.configure = createComponentConfig<TextareaFieldProps>();

export default TextareaField;
