import Documentation, { createPlayground } from "@/components/Documentation";
import {
    Avatar,
    type AvatarClassNames,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { createSnippet } from "@/utils/createSnippet";

export const Route = createFileRoute("/core/avatar/")({
    component: RouteComponent
});

const AvatarPlayground = createPlayground(
    {
        size: {
            type: "select",
            label: "Size",
            options: ["xs", "sm", "md", "lg", "xl"] as const,
            default: "md"
        },
        radius: {
            type: "select",
            label: "Radius",
            options: [
                "none",
                "xs",
                "sm",
                "md",
                "lg",
                "xl",
                "2xl",
                "3xl",
                "4xl",
                "full"
            ] as const,
            default: "md"
        },
        src: {
            type: "text",
            label: "Image Source",
            default: "https://github.com/refraktorui.png"
        }
    },
    {
        code: (props, defaults) => {
            const sharedProps = { size: props.size, radius: props.radius };
            const sharedDefaults = {
                size: defaults.size,
                radius: defaults.radius
            };

            return createSnippet({
                imports: [`import { Avatar } from "@refraktor/core";`],
                component: "Avatar",
                values: {
                    ...sharedProps,
                    src: props.src,
                    alt: "Refraktor"
                },
                defaults: { ...sharedDefaults }
            });
        }
    }
);

interface AvatarSlotsShowcaseProps {
    classNames?: AvatarClassNames;
}

function AvatarSlotsShowcase({ classNames }: AvatarSlotsShowcaseProps) {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                src="https://github.com/refraktorui.png"
                alt="Avatar image"
                classNames={{
                    root: classNames?.root,
                    image: classNames?.image
                }}
            />
            <Avatar
                name="Ada Lovelace"
                classNames={{
                    root: classNames?.root,
                    initials: classNames?.initials
                }}
            />
            <Avatar
                fallback={<span className="text-xs font-semibold">NA</span>}
                classNames={{
                    root: classNames?.root,
                    fallback: classNames?.fallback
                }}
            />
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Avatar"
                description="Display a user image with graceful fallback states for initials and icons. Supports custom sizes, radii, and grouped stacking via Avatar.Group."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/avatar/avatar.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <AvatarPlayground.Wrapper>
                            <AvatarPlayground.Preview>
                                {({ size, radius, src }) => {
                                    const sharedProps = {
                                        size: size as RefraktorSize,
                                        radius: radius as RefraktorRadius
                                    };

                                    return (
                                        <Avatar
                                            {...sharedProps}
                                            src={src}
                                            alt="Refraktor"
                                        />
                                    );
                                }}
                            </AvatarPlayground.Preview>

                            <AvatarPlayground.Controls />

                            <AvatarPlayground.Code />
                        </AvatarPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="initials"
                        title="Initials"
                        description="Initials are used to display a fallback when the image source is not available."
                    >
                        <Documentation.Showcase
                            code={`import { Avatar } from "@refraktor/core";

export function Demo() {
  return <Avatar name="Refraktor Showcase" />;
}`}
                        >
                            <Avatar name="Refraktor Showcase" />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="group"
                        title="Avatar.Group"
                        description="Stack multiple avatars with configurable overlap and an automatic overflow counter."
                    >
                        <Documentation.Showcase
                            code={`import { Avatar } from "@refraktor/core";

export function Demo() {
  return (
    <Avatar.Group limit={4} spacing={-10}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" />
      <Avatar name="Katherine Johnson" />
      <Avatar name="Margaret Hamilton" />
    </Avatar.Group>
  );
}`}
                        >
                            <Avatar.Group limit={4} spacing={-10}>
                                <Avatar name="Ada Lovelace" />
                                <Avatar name="Grace Hopper" />
                                <Avatar name="Alan Turing" />
                                <Avatar name="Katherine Johnson" />
                                <Avatar name="Margaret Hamilton" />
                            </Avatar.Group>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts. This preview renders image, initials, and fallback variants together so each slot can be inspected."
                    >
                        <Documentation.ClassesInspector
                            Component={AvatarSlotsShowcase}
                            slots={["root", "image", "initials", "fallback"]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="avatar-props"
                        title="Avatar Props"
                        description="The props for the Avatar component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="src"
                                type="string | null"
                                description="Image source URL. If missing or invalid, Avatar falls back to initials or fallback content."
                            />
                            <Documentation.Props.Content
                                name="alt"
                                type="string"
                                description="Alt text for the avatar image."
                            />
                            <Documentation.Props.Content
                                name="name"
                                type="string"
                                description="Used to generate initials when initials is not provided."
                            />
                            <Documentation.Props.Content
                                name="initials"
                                type="string"
                                description="Explicit initials value that overrides generated initials from name."
                            />
                            <Documentation.Props.Content
                                name="fallback"
                                type="ReactNode"
                                description="Custom fallback content shown when image and initials are not available."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls the avatar dimensions and text size."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"full"'
                                description="Controls border radius on the root element."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="AvatarClassNames"
                                description="Slot-level class overrides for root, image, initials, and fallback."
                            />
                        </Documentation.Props>
                    </Documentation.Section>

                    <Documentation.Section
                        id="avatar-group-props"
                        title="Avatar.Group Props"
                        description="The props for the Avatar.Group compound component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode"
                                description="Avatar elements to render inside the group."
                                required
                            />
                            <Documentation.Props.Content
                                name="spacing"
                                type="number"
                                default="-8"
                                description="Horizontal spacing between avatars. Use negative values to create overlap."
                            />
                            <Documentation.Props.Content
                                name="limit"
                                type="number"
                                default="5"
                                description="Maximum avatars shown before rendering a +N overflow avatar."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the group root element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="AvatarGroupClassNames"
                                description="Slot-level class overrides for the group root."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
