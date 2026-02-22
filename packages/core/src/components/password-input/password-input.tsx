import { useUncontrolled } from "@refraktor/utils";
import { EyeIcon, EyeOffIcon } from "../../icons";
import { useTheme } from "../../theme";
import { createComponentConfig, factory, useProps } from "../../utils";
import { Input } from "../input";
import {
    PasswordInputFactoryPayload,
    PasswordInputProps
} from "./password-input.types";

const defaultProps = {
    withVisibilityToggle: true,
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password"
} satisfies Partial<PasswordInputProps>;

const PasswordInput = factory<PasswordInputFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const {
        visible,
        defaultVisible,
        onVisibilityChange,
        withVisibilityToggle,
        showPasswordLabel,
        hidePasswordLabel,
        rightSection,
        disabled,
        ...props
    } = useProps("PasswordInput", defaultProps, _props);

    const [isVisible, setVisible] = useUncontrolled({
        value: visible,
        defaultValue: defaultVisible,
        finalValue: false,
        onChange: onVisibilityChange
    });

    const Icon = isVisible ? EyeOffIcon : EyeIcon;
    const toggleLabel = isVisible ? hidePasswordLabel : showPasswordLabel;

    const visibilityToggle = (
        <button
            type="button"
            disabled={disabled}
            aria-label={toggleLabel}
            aria-pressed={isVisible}
            className={cx(
                "inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--refraktor-text-secondary)] transition-colors hover:text-[var(--refraktor-text)]",
                disabled && "cursor-not-allowed opacity-50"
            )}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setVisible(!isVisible)}
        >
            <Icon size={16} />
        </button>
    );

    let resolvedRightSection = rightSection;

    if (withVisibilityToggle) {
        resolvedRightSection = rightSection ? (
            <span className="inline-flex items-center gap-1">
                {rightSection}
                {visibilityToggle}
            </span>
        ) : (
            visibilityToggle
        );
    }

    return (
        <Input
            {...props}
            ref={ref}
            type={isVisible ? "text" : "password"}
            disabled={disabled}
            rightSection={resolvedRightSection}
        />
    );
});

PasswordInput.displayName = "@refraktor/core/PasswordInput";
PasswordInput.configure = createComponentConfig<PasswordInputProps>();

export default PasswordInput;
