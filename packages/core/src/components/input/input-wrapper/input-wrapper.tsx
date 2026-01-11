import { factory, useProps, cx, createComponentConfig } from "../../../utils";
import { InputDescription } from "../input-description";
import { InputError } from "../input-error";
import { InputLabel } from "../input-label";
import { InputWrapperFactoryPayload, InputWrapperProps } from "../input.types";

const InputWrapper = factory<InputWrapperFactoryPayload>((_props, ref) => {
    const {
        label,
        description,
        error,
        required,
        withAsterisk,
        inputId,
        children,
        className,
        ...props
    } = useProps("InputWrapper", null, _props);

    const showAsterisk = withAsterisk || required;

    return (
        <div ref={ref} className={cx("flex flex-col", className)} {...props}>
            {label && (
                <InputLabel htmlFor={inputId} required={showAsterisk}>
                    {label}
                </InputLabel>
            )}

            {description && <InputDescription>{description}</InputDescription>}

            {children}

            {error && typeof error !== "boolean" && (
                <InputError>{error}</InputError>
            )}
        </div>
    );
});

InputWrapper.displayName = "@refraktor/core/InputWrapper";

export default InputWrapper;
