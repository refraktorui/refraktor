import { useId } from "@refraktor/utils";
import { Children, cloneElement, isValidElement } from "react";
import { useTheme } from "../../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../../utils";
import {
    AvatarGroupClassNames,
    AvatarGroupFactoryPayload,
    AvatarGroupProps
} from "../avatar.types";
import Avatar from "../avatar";

const defaultProps = {
    spacing: -8,
    limit: 5
} satisfies Partial<AvatarGroupProps>;

const AvatarGroup = factory<AvatarGroupFactoryPayload>((_props, ref) => {
    const { cx } = useTheme();
    const { id, children, spacing, limit, className, classNames, ...props } =
        useProps("AvatarGroup", defaultProps, _props);
    const classes = useClassNames("AvatarGroup", classNames);

    const _id = useId(id);

    const childArray = Children.toArray(children);
    const visibleChildren = limit ? childArray.slice(0, limit) : childArray;
    const remainingCount = limit ? Math.max(0, childArray.length - limit) : 0;

    return (
        <div
            ref={ref}
            id={_id}
            className={cx("inline-flex items-center", classes.root, className)}
            {...props}
        >
            {visibleChildren.map((child, index) => {
                if (!isValidElement(child)) return null;

                return cloneElement(child as any, {
                    key: index,
                    style: {
                        marginLeft: index === 0 ? 0 : spacing,
                        zIndex: visibleChildren.length - index,
                        ...((child.props as any).style || {})
                    },
                    className: (child.props as any).className
                });
            })}

            {remainingCount > 0 && (
                <Avatar
                    initials={`+${remainingCount}`}
                    style={{
                        marginLeft: spacing,
                        zIndex: 0
                    }}
                />
            )}
        </div>
    );
});

AvatarGroup.displayName = "@refraktor/core/AvatarGroup";
AvatarGroup.configure = createComponentConfig<AvatarGroupProps>();
AvatarGroup.classNames = createClassNamesConfig<AvatarGroupClassNames>();

export default AvatarGroup;
