import { useId } from "@refraktor/utils";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    BadgeClassNames,
    BadgeFactoryPayload,
    BadgeProps
} from "./badge.types";
import { getSize, getVariant } from "./badge.styles";

const defaultProps = {
    size: "xs",
    radius: "default",
    variant: "default"
} satisfies Partial<BadgeProps>;

const Badge = factory<BadgeFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        children,
        id,
        size,
        radius,
        variant,
        className,
        classNames,
        ...props
    } = useProps("Badge", defaultProps, _props);
    const classes = useClassNames("Badge", classNames);

    const _id = useId(id);

    return (
        <div
            id={_id}
            ref={ref}
            className={cx(
                "inline-flex items-center justify-center w-fit",
                getSize(size),
                getRadius(radius),
                getVariant(variant),
                classes.root,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Badge.displayName = "@refraktor/core/Badge";
Badge.configure = createComponentConfig<BadgeProps>();
Badge.classNames = createClassNamesConfig<BadgeClassNames>();

export default Badge;
