import {
    createClassNamesConfig,
    createComponentConfig,
    FactoryPayload
} from "../../utils";
import type { InputProps } from "../input";

export type FileInputRejectCode =
    | "invalid-type"
    | "file-too-large"
    | "file-too-small"
    | "too-many-files";

export interface FileInputRejection {
    /** Rejected file */
    file: File;

    /** Rejection reason code */
    code: FileInputRejectCode;

    /** Human-readable rejection reason */
    message: string;
}

export type FileInputClassNames = {
    root?: string;
    trigger?: string;
    value?: string;
    placeholder?: string;
    files?: string;
    clear?: string;
};

export interface FileInputProps
    extends Omit<
        InputProps,
        | "type"
        | "value"
        | "defaultValue"
        | "onChange"
        | "leftSection"
        | "rightSection"
    > {
    /** Placeholder shown when no files are selected */
    placeholder?: string;

    /** Whether to show clear button when value exists @default `true` */
    clearable?: boolean;

    /** Maximum allowed file size in bytes */
    maxSize?: number;

    /** Minimum allowed file size in bytes */
    minSize?: number;

    /** Maximum allowed number of files */
    maxFiles?: number;

    /** Callback called with accepted files */
    onChange?: (files: File[]) => void;

    /** Callback called with rejected files */
    onReject?: (rejections: FileInputRejection[]) => void;

    /** Used for styling different parts of the component */
    classNames?: FileInputClassNames;
}

export interface FileInputFactoryPayload extends FactoryPayload {
    props: FileInputProps;
    ref: HTMLInputElement;
    compound: {
        configure: ReturnType<typeof createComponentConfig<FileInputProps>>;
        classNames: ReturnType<
            typeof createClassNamesConfig<FileInputClassNames>
        >;
    };
}
