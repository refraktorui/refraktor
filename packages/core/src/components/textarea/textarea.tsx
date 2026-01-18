import { useId } from "@refraktor/utils";
import { createComponentConfig, factory, useProps } from "../../utils";
import { TextareaFactoryPayload, TextareaProps } from "./textarea.types";
import { InputWrapper } from "../input/input-wrapper";
import { TextareaField } from "./textarea-field";

const defaultProps = {
    variant: "default",
    size: "md",
    radius: "default"
} satisfies Partial<TextareaProps>;

const Textarea = factory<TextareaFactoryPayload>((_props, ref) => {
    const { id, label, description, error, required, withAsterisk, ...props } =
        useProps("Textarea", defaultProps, _props);

    const _id = useId(id);

    const hasWrapper = label || description || error;

    if (!hasWrapper) {
        return (
            <TextareaField
                ref={ref}
                id={_id}
                required={required}
                error={!!error}
                {...props}
            />
        );
    }

    return (
        <InputWrapper
            label={label}
            description={description}
            error={error}
            required={required}
            withAsterisk={withAsterisk}
            inputId={_id}
        >
            <TextareaField
                ref={ref}
                id={_id}
                required={required}
                error={!!error}
                aria-describedby={
                    error
                        ? `${_id}-error`
                        : description
                          ? `${_id}-description`
                          : undefined
                }
                {...props}
            />
        </InputWrapper>
    );
});

Textarea.displayName = "@refraktor/core/Textarea";
Textarea.configure = createComponentConfig<TextareaProps>();
Textarea.Field = TextareaField;

export default Textarea;
