import Documentation, { createPlayground } from "@/components/Documentation";
import { createSnippet } from "@/utils/createSnippet";
import {
    FileInput,
    type FileInputClassNames,
    type FileInputRejection,
    type RefraktorRadius,
    type RefraktorSize
} from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/core/file-input/")({
    component: RouteComponent
});

const FileInputPlayground = createPlayground(
    {
        variant: {
            type: "segmented",
            label: "Variant",
            options: ["default", "filled", "outline"] as const,
            default: "default"
        },
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
                "default",
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
            default: "default"
        },
        multiple: {
            type: "switch",
            label: "Multiple",
            default: false
        },
        clearable: {
            type: "switch",
            label: "Clearable",
            default: true
        },
        disabled: {
            type: "switch",
            label: "Disabled",
            default: false
        },
        required: {
            type: "switch",
            label: "Required",
            default: false
        },
        description: {
            type: "switch",
            label: "Description",
            default: false
        },
        error: {
            type: "switch",
            label: "Error",
            default: false
        },
        label: {
            type: "text",
            label: "Label",
            default: "Attachments"
        },
        placeholder: {
            type: "text",
            label: "Placeholder",
            default: ""
        },
        accept: {
            type: "text",
            label: "Accept",
            default: ""
        }
    },
    {
        code: (props, defaults) => {
            const label = props.label.trim() || "Attachments";
            const placeholder = props.placeholder.trim() || undefined;
            const accept = props.accept.trim() || undefined;

            return createSnippet({
                imports: [`import { FileInput } from "@refraktor/core";`],
                component: "FileInput",
                values: {
                    variant: props.variant,
                    size: props.size,
                    radius: props.radius,
                    multiple: props.multiple,
                    clearable: props.clearable,
                    disabled: props.disabled,
                    required: props.required,
                    description: props.description
                        ? "Upload files that support your request."
                        : undefined,
                    error: props.error
                        ? "Please upload at least one file"
                        : undefined,
                    label,
                    placeholder,
                    accept
                },
                defaults: {
                    variant: defaults.variant,
                    size: defaults.size,
                    radius: defaults.radius,
                    multiple: defaults.multiple,
                    clearable: defaults.clearable,
                    disabled: defaults.disabled,
                    required: defaults.required
                }
            });
        }
    }
);

function FileInputSlotsShowcase({
    classNames
}: {
    classNames?: FileInputClassNames;
}) {
    return (
        <FileInput
            label="Government ID"
            description="Accepted formats: PDF, PNG"
            placeholder="Upload ID file"
            classNames={classNames}
        />
    );
}

function ValidationFeedbackShowcase() {
    const [rejections, setRejections] = useState<FileInputRejection[]>([]);

    return (
        <div className="w-full flex flex-col gap-3">
            <FileInput
                label="Verification documents"
                description="Up to 2 files, max 1 MB each, images or PDF only."
                multiple
                maxFiles={2}
                maxSize={1_000_000}
                accept="image/*,.pdf"
                onReject={setRejections}
            />

            {rejections.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-[var(--refraktor-colors-red-6)] space-y-1">
                    {rejections.map((item) => (
                        <li key={`${item.file.name}-${item.code}`}>
                            {item.file.name}: {item.message}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-dark-300">
                    Try selecting 3 files or unsupported extensions to see
                    rejection messages.
                </p>
            )}
        </div>
    );
}

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="FileInput"
                description="Upload single or multiple files with built-in type, size, and count validation while keeping the same sizing and wrapper API as other input components."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/file-input/file-input.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <FileInputPlayground.Wrapper>
                            <FileInputPlayground.Preview>
                                {({
                                    variant,
                                    size,
                                    radius,
                                    multiple,
                                    clearable,
                                    disabled,
                                    required,
                                    description,
                                    error,
                                    label,
                                    placeholder,
                                    accept
                                }) => (
                                    <FileInput
                                        key={`${variant}-${size}-${radius}-${multiple}-${clearable}-${disabled}-${required}-${description}-${error}-${label}-${placeholder}-${accept}`}
                                        variant={
                                            variant as
                                                | "default"
                                                | "filled"
                                                | "outline"
                                        }
                                        size={size as RefraktorSize}
                                        radius={radius as RefraktorRadius}
                                        multiple={multiple}
                                        clearable={clearable}
                                        disabled={disabled}
                                        required={required}
                                        label={label.trim() || "Attachments"}
                                        placeholder={
                                            placeholder.trim() || undefined
                                        }
                                        accept={accept.trim() || undefined}
                                        description={
                                            description
                                                ? "Upload files that support your request."
                                                : undefined
                                        }
                                        error={
                                            error
                                                ? "Please upload at least one file"
                                                : undefined
                                        }
                                        className="w-full"
                                    />
                                )}
                            </FileInputPlayground.Preview>

                            <FileInputPlayground.Controls />

                            <FileInputPlayground.Code />
                        </FileInputPlayground.Wrapper>
                    </Documentation.Section>

                    <Documentation.Section
                        id="multiple-files"
                        title="Multiple files"
                        description="Enable multiple selection and limit accepted files with maxFiles when users can attach more than one file."
                    >
                        <Documentation.Showcase
                            code={`import { FileInput } from "@refraktor/core";

export function Demo() {
  return (
    <FileInput
      label="Attachments"
      multiple
      maxFiles={3}
      clearable
    />
  );
}`}
                        >
                            <FileInput
                                label="Attachments"
                                multiple
                                maxFiles={3}
                                clearable
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="accept-types"
                        title="Accept file types"
                        description="Use accept to constrain selectable MIME types or file extensions."
                    >
                        <Documentation.Showcase
                            code={`import { FileInput } from "@refraktor/core";

export function Demo() {
  return (
    <FileInput
      label="Cover image"
      accept="image/png,image/jpeg"
      placeholder="PNG or JPEG"
    />
  );
}`}
                        >
                            <FileInput
                                label="Cover image"
                                accept="image/png,image/jpeg"
                                placeholder="PNG or JPEG"
                            />
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="validation-feedback"
                        title="Validation feedback"
                        description="Handle onReject to surface clear feedback when files fail type, size, or count checks."
                    >
                        <Documentation.Showcase
                            code={`import { FileInput, type FileInputRejection } from "@refraktor/core";
import { useState } from "react";

export function Demo() {
  const [rejections, setRejections] = useState<FileInputRejection[]>([]);

  return (
    <>
      <FileInput
        label="Verification documents"
        multiple
        maxFiles={2}
        maxSize={1_000_000}
        accept="image/*,.pdf"
        onReject={setRejections}
      />

      {rejections.map((item) => (
        <p key={item.file.name}>{item.message}</p>
      ))}
    </>
  );
}`}
                        >
                            <ValidationFeedbackShowcase />
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="classes">
                    <Documentation.Section
                        id="file-input-classnames"
                        title="Classnames"
                        description="Hover slot names to highlight matching parts of FileInput."
                    >
                        <Documentation.ClassesInspector
                            Component={FileInputSlotsShowcase}
                            slots={[
                                "root",
                                "trigger",
                                "value",
                                "placeholder",
                                "files",
                                "clear"
                            ]}
                        />
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="file-input-props"
                        title="FileInput Props"
                        description="The props for the FileInput component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="label"
                                type="ReactNode"
                                description="Label text rendered above the trigger."
                            />
                            <Documentation.Props.Content
                                name="description"
                                type="ReactNode"
                                description="Helper text rendered below the label."
                            />
                            <Documentation.Props.Content
                                name="error"
                                type="ReactNode"
                                description="Error message rendered below the description."
                            />
                            <Documentation.Props.Content
                                name="placeholder"
                                type="string"
                                description="Custom text shown before files are selected."
                            />
                            <Documentation.Props.Content
                                name="accept"
                                type="string"
                                description="Allowed MIME types or extensions, for example image/*,.pdf."
                            />
                            <Documentation.Props.Content
                                name="multiple"
                                type="boolean"
                                default="false"
                                description="Allows selecting multiple files."
                            />
                            <Documentation.Props.Content
                                name="maxFiles"
                                type="number"
                                description="Maximum allowed number of files."
                            />
                            <Documentation.Props.Content
                                name="minSize"
                                type="number"
                                description="Minimum allowed file size in bytes."
                            />
                            <Documentation.Props.Content
                                name="maxSize"
                                type="number"
                                description="Maximum allowed file size in bytes."
                            />
                            <Documentation.Props.Content
                                name="onChange"
                                type="(files: File[]) => void"
                                description="Called with accepted files after each selection."
                            />
                            <Documentation.Props.Content
                                name="onReject"
                                type="(rejections: FileInputRejection[]) => void"
                                description="Called with rejected files and reason codes."
                            />
                            <Documentation.Props.Content
                                name="clearable"
                                type="boolean"
                                default="true"
                                description="Shows a clear button after files are selected."
                            />
                            <Documentation.Props.Content
                                name="variant"
                                type='"default" | "filled" | "outline"'
                                default='"default"'
                                description="Controls field background and border style."
                            />
                            <Documentation.Props.Content
                                name="size"
                                type='"xs" | "sm" | "md" | "lg" | "xl"'
                                default='"md"'
                                description="Controls field height, padding, and text size."
                            />
                            <Documentation.Props.Content
                                name="radius"
                                type='"none" | "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"'
                                default='"default"'
                                description="Controls border radius of the trigger field."
                            />
                            <Documentation.Props.Content
                                name="disabled"
                                type="boolean"
                                default="false"
                                description="Disables opening and clearing files."
                            />
                            <Documentation.Props.Content
                                name="required"
                                type="boolean"
                                default="false"
                                description="Marks the underlying file input as required."
                            />
                            <Documentation.Props.Content
                                name="withAsterisk"
                                type="boolean"
                                default="false"
                                description="Shows an asterisk next to the label when the field is required."
                            />
                            <Documentation.Props.Content
                                name="className"
                                type="string"
                                description="Adds custom classes to the trigger element."
                            />
                            <Documentation.Props.Content
                                name="classNames"
                                type="FileInputClassNames"
                                description="Slot-level class overrides for root, trigger, value, placeholder, files, and clear."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
