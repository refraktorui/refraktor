import { useId } from "@refraktor/utils";
import { useState, useEffect } from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import {
    AvatarClassNames,
    AvatarFactoryPayload,
    AvatarProps
} from "./avatar.types";
import { getSize } from "./avatar.styles";
import { AvatarGroup } from "./avatar-group";
import { UserIcon } from "../../icons";

const defaultProps = {
    size: "md",
    radius: "full"
} satisfies Partial<AvatarProps>;

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "";
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Avatar = factory<AvatarFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        src,
        alt,
        name,
        initials,
        fallback,
        children,
        size,
        radius,
        className,
        classNames,
        ...props
    } = useProps("Avatar", defaultProps, _props);
    const classes = useClassNames("Avatar", classNames);

    const _id = useId(id);

    const [imageStatus, setImageStatus] = useState<
        "loading" | "loaded" | "error"
    >(src ? "loading" : "error");

    useEffect(() => {
        if (src) {
            setImageStatus("loading");
        } else {
            setImageStatus("error");
        }
    }, [src]);

    const handleImageLoad = () => {
        setImageStatus("loaded");
    };

    const handleImageError = () => {
        setImageStatus("error");
    };

    const displayInitials = initials || (name ? getInitials(name) : null);

    const showImage = src && imageStatus !== "error";

    const showInitials = !showImage && displayInitials;

    const showFallback = !showImage && !showInitials;

    const fallbackContent = children ?? fallback ?? <UserIcon size={24} />;

    return (
        <div
            ref={ref}
            id={_id}
            className={cx(
                "relative inline-flex items-center justify-center overflow-hidden shrink-0",
                "bg-[var(--refraktor-bg-hover)]",
                getSize(size),
                getRadius(radius),
                classes.root,
                className
            )}
            {...props}
        >
            {showImage && (
                <img
                    src={src}
                    alt={alt || name || "Avatar"}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={cx(
                        "w-full h-full object-cover",
                        imageStatus === "loading" && "opacity-0",
                        imageStatus === "loaded" &&
                            "opacity-100 transition-opacity duration-200",
                        classes.image
                    )}
                />
            )}

            {showInitials && (
                <span
                    className={cx("font-medium select-none", classes.initials)}
                    aria-label={name || alt}
                >
                    {displayInitials}
                </span>
            )}

            {showFallback && (
                <span
                    className={cx(
                        "text-[var(--refraktor-text-muted)] flex items-center justify-center",
                        classes.fallback
                    )}
                    aria-label="Avatar"
                >
                    {fallbackContent}
                </span>
            )}
        </div>
    );
});

Avatar.displayName = "@refraktor/core/Avatar";
Avatar.configure = createComponentConfig<AvatarProps>();
Avatar.classNames = createClassNamesConfig<AvatarClassNames>();
Avatar.Group = AvatarGroup;

export default Avatar;
