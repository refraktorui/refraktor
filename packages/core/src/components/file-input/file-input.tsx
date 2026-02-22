import { useId, useMergedRefs } from "@refraktor/utils";
import { useMemo, useRef, useState } from "react";
import { XIcon } from "../../icons";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { getSize, getVariant } from "../input/input-field/input-field.styles";
import { InputWrapper } from "../input/input-wrapper";
import {
    FileInputClassNames,
    FileInputFactoryPayload,
    FileInputProps
} from "./file-input.types";
import { formatFileSummary, validateFiles } from "./file-input.utils";

const defaultProps = {
    variant: "default",
    size: "md",
    radius: "default",
    clearable: true
} satisfies Partial<FileInputProps>;

const FileInput = factory<FileInputFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        label,
        description,
        error,
        required,
        withAsterisk,
        variant,
        size,
        radius,
        multiple,
        placeholder,
        clearable,
        maxSize,
        minSize,
        maxFiles,
        onChange,
        onReject,
        className,
        classNames,
        disabled,
        accept,
        ...props
    } = useProps("FileInput", defaultProps, _props);

    const classes = useClassNames<FileInputClassNames>("FileInput", classNames);
    const _id = useId(id);

    const localRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, localRef);

    const [files, setFiles] = useState<File[]>([]);

    const hasWrapper = label || description || error;
    const hasValue = files.length > 0;
    const describedBy = error
        ? `${_id}-error`
        : description
          ? `${_id}-description`
          : undefined;

    const summary = useMemo(() => formatFileSummary(files), [files]);
    const resolvedPlaceholder = placeholder ?? (multiple ? "Select files" : "Select file");

    const openPicker = () => {
        if (disabled) {
            return;
        }

        localRef.current?.click();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.currentTarget.files ?? []);

        if (selectedFiles.length === 0) {
            return;
        }

        const { accepted, rejections } = validateFiles(selectedFiles, {
            accept,
            minSize,
            maxSize,
            maxFiles,
            multiple
        });

        setFiles(accepted);
        onChange?.(accepted);

        if (rejections.length > 0) {
            onReject?.(rejections);
        }
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
        }
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (disabled) {
            return;
        }

        if (localRef.current) {
            localRef.current.value = "";
        }

        setFiles([]);
        onChange?.([]);
    };

    const field = (
        <div className={cx("relative w-full", classes.root)}>
            <input
                {...props}
                id={_id}
                ref={mergedRef}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 opacity-0"
                onClick={(event) => {
                    event.currentTarget.value = "";
                }}
                onChange={handleInputChange}
            />

            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cx(
                    "w-full flex items-center gap-2 transition-all",
                    "focus-visible:border-[var(--refraktor-primary)]",
                    "select-none",
                    getSize(size),
                    getVariant(variant),
                    getRadius(radius),
                    error && "border-[var(--refraktor-colors-red-6)]",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                    classes.trigger,
                    className
                )}
                onClick={openPicker}
                onKeyDown={handleTriggerKeyDown}
            >
                <span
                    className={cx(
                        "min-w-0 flex-1 truncate",
                        classes.value,
                        hasValue
                            ? cx("text-[var(--refraktor-text)]", classes.files)
                            : cx(
                                  "text-[var(--refraktor-text-tertiary)]",
                                  classes.placeholder
                              )
                    )}
                >
                    {hasValue ? summary : resolvedPlaceholder}
                </span>

                {clearable && hasValue && !disabled && (
                    <button
                        type="button"
                        className={cx(
                            "inline-flex h-4 w-4 items-center justify-center rounded-full border-0 bg-transparent p-0",
                            "text-[var(--refraktor-text-secondary)] transition-colors hover:text-[var(--refraktor-text)]",
                            classes.clear
                        )}
                        aria-label={files.length > 1 ? "Clear files" : "Clear file"}
                        onClick={handleClear}
                    >
                        <XIcon size={12} />
                    </button>
                )}
            </div>
        </div>
    );

    if (!hasWrapper) {
        return field;
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
            {field}
        </InputWrapper>
    );
});

FileInput.displayName = "@refraktor/core/FileInput";
FileInput.configure = createComponentConfig<FileInputProps>();
FileInput.classNames = createClassNamesConfig<FileInputClassNames>();

export default FileInput;
