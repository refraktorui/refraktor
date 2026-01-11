import { useId } from "@refraktor/utils";
import { createComponentConfig, factory, useProps } from "../../utils";
import { InputFactoryPayload, InputProps } from "./input.types";
import { InputWrapper } from "./input-wrapper";
import { InputLabel } from "./input-label";
import { InputDescription } from "./input-description";
import { InputError } from "./input-error";
import { InputField } from "./input-field";

const defaultProps = {
    variant: "default",
    size: "md",
    radius: "default"
} satisfies Partial<InputProps>;

const Input = factory<InputFactoryPayload>((_props, ref) => {
    const { id, label, description, error, required, withAsterisk, ...props } =
        useProps("Input", defaultProps, _props);

    const _id = useId(id);

    const hasWrapper = label || description || error;

    if (!hasWrapper) {
        return (
            <InputField
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
            <InputField
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

Input.displayName = "@refraktor/core/Input";
Input.configure = createComponentConfig<InputProps>();
Input.Wrapper = InputWrapper;
Input.Label = InputLabel;
Input.Description = InputDescription;
Input.Error = InputError;
Input.Field = InputField;

export default Input;
