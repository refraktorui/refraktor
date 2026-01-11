import { useId } from "@refraktor/utils";
import {
    createClassNamesConfig,
    createComponentConfig,
    polymorphicFactory,
    useClassNames,
    useProps
} from "../../utils";
import { useTheme } from "../../theme";
import { Loader } from "../loader";
import {
    ButtonClassNames,
    ButtonFactoryPayload,
    ButtonProps
} from "./button.types";
import { getSize, getVariant } from "./button.styles";

const defaultProps = {
    size: "md",
    radius: "md",
    variant: "default"
} satisfies Partial<ButtonProps>;

const Button = polymorphicFactory<ButtonFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        as,
        children,
        id,
        size,
        radius,
        variant,
        disabled,
        loading,
        loaderProps,
        fullWidth,
        leftSection,
        rightSection,
        classNames,
        className,
        ...props
    } = useProps("Button", defaultProps, _props);
    const classes = useClassNames("Button", classNames);

    const Component = as ?? "button";
    const _id = useId(id);

    return (
        <Component
            id={_id}
            ref={ref}
            disabled={Component === "button" ? disabled || loading : undefined}
            className={cx(
                "inline-flex items-center justify-center cursor-pointer transition-all",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none select-none active:scale-[0.98]",
                "[&[data-disabled=true]]:opacity-50 [&[data-disabled=true]]:pointer-events-none [&[data-disabled=true]]:cursor-not-allowed",
                fullWidth && "w-full",
                getSize(size),
                getRadius(radius),
                getVariant(variant),
                classes.root,
                className
            )}
            {...props}
            data-disabled={disabled || loading}
            aria-disabled={disabled || loading}
        >
            <div
                className={cx(
                    "inline-flex items-center justify-center",
                    classes.container
                )}
            >
                {(loading || leftSection) && (
                    <span
                        className={cx(
                            "shrink-0 mr-2 inline-flex",
                            classes.leftSection
                        )}
                    >
                        {loading ? (
                            <Loader size={16} {...loaderProps} />
                        ) : (
                            leftSection
                        )}
                    </span>
                )}

                {children}

                {rightSection && (
                    <span
                        className={cx(
                            "shrink-0 ml-2 inline-flex",
                            classes.rightSection
                        )}
                    >
                        {rightSection}
                    </span>
                )}
            </div>
        </Component>
    );
});

Button.displayName = "@refraktor/core/Button";
Button.configure = createComponentConfig<ButtonProps>();
Button.classNames = createClassNamesConfig<ButtonClassNames>();

export default Button;
