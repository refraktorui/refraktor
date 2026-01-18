import { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefraktorRadius, RefraktorSize } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import { AvatarGroup } from "./avatar-group";

export type AvatarClassNames = {
    root?: string;
    image?: string;
    initials?: string;
    fallback?: string;
};

export interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
    /** Image source URL */
    src?: string | null;

    /** Alt text for the image */
    alt?: string;

    /** Name used to generate initials (e.g., "John Doe" -> "JD") */
    name?: string;

    /** Custom initials to display (overrides name-based initials) */
    initials?: string;

    /** Custom fallback element when no image or initials */
    fallback?: ReactNode;

    /** The size of the avatar @default `md` */
    size?: RefraktorSize;

    /** The radius of the avatar @default `full` */
    radius?: RefraktorRadius;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: AvatarClassNames;
}

export interface AvatarFactoryPayload extends FactoryPayload {
    props: AvatarProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<AvatarProps>>;
        classNames: ReturnType<typeof createClassNamesConfig<AvatarClassNames>>;
        Group: typeof AvatarGroup;
    };
}

export type AvatarGroupClassNames = {
    root?: string;
};

export interface AvatarGroupProps extends ComponentPropsWithoutRef<"div"> {
    /** Avatar components to render */
    children: ReactNode;

    /** Spacing between avatars (negative value creates overlap) @default `-8` */
    spacing?: number;

    /** Maximum number of avatars to display @default `5` */
    limit?: number;

    /** Used for editing root class name */
    className?: string;

    /** Used for styling different parts of the component */
    classNames?: AvatarGroupClassNames;
}

export interface AvatarGroupFactoryPayload extends FactoryPayload {
    props: AvatarGroupProps;
    ref: HTMLDivElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<AvatarGroupProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<AvatarGroupClassNames>
        >;
    };
}
