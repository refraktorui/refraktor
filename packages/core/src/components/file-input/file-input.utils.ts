import {
    FileInputRejectCode,
    FileInputRejection,
    FileInputProps
} from "./file-input.types";

type ValidationOptions = Pick<
    FileInputProps,
    "accept" | "maxFiles" | "maxSize" | "minSize" | "multiple"
>;

type ValidationResult = {
    accepted: File[];
    rejections: FileInputRejection[];
};

const createRejection = (
    file: File,
    code: FileInputRejectCode,
    message: string
): FileInputRejection => ({ file, code, message });

export const matchesAccept = (file: File, accept?: string): boolean => {
    if (!accept) {
        return true;
    }

    const tokens = accept
        .split(",")
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);

    if (tokens.length === 0) {
        return true;
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    return tokens.some((token) => {
        if (token === "*/*") {
            return true;
        }

        if (token.startsWith(".")) {
            return fileName.endsWith(token);
        }

        if (token.endsWith("/*")) {
            return fileType.startsWith(token.slice(0, -1));
        }

        return fileType === token;
    });
};

export const validateFiles = (
    files: File[],
    { accept, minSize, maxSize, maxFiles, multiple }: ValidationOptions
): ValidationResult => {
    const accepted: File[] = [];
    const rejections: FileInputRejection[] = [];

    const isMinSizeDefined = typeof minSize === "number" && minSize >= 0;
    const isMaxSizeDefined = typeof maxSize === "number" && maxSize >= 0;
    const maxAllowedFiles =
        typeof maxFiles === "number"
            ? Math.max(0, Math.floor(maxFiles))
            : multiple
              ? Number.POSITIVE_INFINITY
              : 1;

    files.forEach((file, index) => {
        if (index >= maxAllowedFiles) {
            rejections.push(
                createRejection(
                    file,
                    "too-many-files",
                    `Only ${maxAllowedFiles} file${maxAllowedFiles === 1 ? "" : "s"} allowed`
                )
            );
            return;
        }

        if (!matchesAccept(file, accept)) {
            rejections.push(
                createRejection(file, "invalid-type", "File type is not allowed")
            );
            return;
        }

        if (isMinSizeDefined && file.size < minSize) {
            rejections.push(
                createRejection(
                    file,
                    "file-too-small",
                    `File is smaller than ${minSize} bytes`
                )
            );
            return;
        }

        if (isMaxSizeDefined && file.size > maxSize) {
            rejections.push(
                createRejection(
                    file,
                    "file-too-large",
                    `File exceeds ${maxSize} bytes`
                )
            );
            return;
        }

        accepted.push(file);
    });

    return { accepted, rejections };
};

export const formatFileSummary = (files: File[]): string => {
    if (files.length === 0) {
        return "";
    }

    if (files.length === 1) {
        return files[0].name;
    }

    return `${files.length} files selected`;
};
