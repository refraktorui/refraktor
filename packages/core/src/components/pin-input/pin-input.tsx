import { useId, useUncontrolled } from "@refraktor/utils";
import { useCallback, useMemo, useRef } from "react";
import { useTheme } from "../../theme";
import {
    createClassNamesConfig,
    createComponentConfig,
    factory,
    useClassNames,
    useProps
} from "../../utils";
import { getVariant } from "../input/input-field/input-field.styles";
import { InputWrapper } from "../input/input-wrapper";
import {
    PinInputCharacterSet,
    PinInputClassNames,
    PinInputFactoryPayload,
    PinInputProps,
    PinInputTransform
} from "./pin-input.types";

const CHARACTER_SET_PATTERNS: Record<PinInputCharacterSet, RegExp> = {
    numeric: /^[0-9]$/,
    alphabetic: /^[A-Za-z]$/,
    alphanumeric: /^[A-Za-z0-9]$/,
    all: /^.$/
};

const CELL_SIZES = {
    xs: "h-7 w-7 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-14 w-14 text-lg"
} as const;

const defaultProps = {
    length: 6,
    variant: "default",
    size: "md",
    radius: "default",
    mask: false,
    characterSet: "numeric",
    transform: "none",
    ariaLabelPrefix: "Character",
    autoComplete: "one-time-code"
} satisfies Partial<PinInputProps>;

function normalizeLength(value: number | undefined): number {
    const length = Number.isFinite(value) ? Math.trunc(value as number) : 6;
    return Math.max(1, length);
}

function transformCharacter(
    char: string,
    transform: PinInputTransform
): string {
    if (transform === "uppercase") {
        return char.toUpperCase();
    }

    if (transform === "lowercase") {
        return char.toLowerCase();
    }

    return char;
}

function isAllowedCharacter(
    char: string,
    characterSet: PinInputCharacterSet,
    characterPattern?: RegExp
): boolean {
    const pattern = characterPattern ?? CHARACTER_SET_PATTERNS[characterSet];
    pattern.lastIndex = 0;
    return pattern.test(char);
}

function toSanitizedChars(
    value: string,
    options: {
        characterSet: PinInputCharacterSet;
        characterPattern?: RegExp;
        transform: PinInputTransform;
    }
): string[] {
    const result: string[] = [];

    for (const rawChar of value) {
        const transformedChar = transformCharacter(rawChar, options.transform);

        if (
            transformedChar &&
            isAllowedCharacter(
                transformedChar,
                options.characterSet,
                options.characterPattern
            )
        ) {
            result.push(transformedChar);
        }
    }

    return result;
}

function toCellArray(
    value: string,
    length: number,
    options: {
        characterSet: PinInputCharacterSet;
        characterPattern?: RegExp;
        transform: PinInputTransform;
    }
): string[] {
    const chars = toSanitizedChars(value, options).slice(0, length);

    return Array.from({ length }, (_, index) => chars[index] ?? "");
}

function normalizeCells(cells: string[] | undefined, length: number): string[] {
    return Array.from({ length }, (_, index) => cells?.[index] ?? "");
}

const PinInput = factory<PinInputFactoryPayload>((_props, ref) => {
    const { cx, getRadius } = useTheme();
    const {
        id,
        label,
        description,
        error,
        required,
        withAsterisk,
        length,
        value,
        defaultValue,
        onChange,
        onComplete,
        mask,
        characterSet,
        characterPattern,
        transform,
        ariaLabelPrefix,
        name,
        variant,
        size,
        radius,
        disabled,
        className,
        classNames,
        inputMode,
        autoComplete,
        placeholder,
        ...props
    } = useProps("PinInput", defaultProps, _props);

    const classes = useClassNames<PinInputClassNames>("PinInput", classNames);
    const _id = useId(id);

    const resolvedLength = normalizeLength(length);
    const sanitizingOptions = useMemo(
        () => ({
            characterSet,
            characterPattern,
            transform
        }),
        [characterSet, characterPattern, transform]
    );

    const emptyCells = useMemo(
        () => Array.from({ length: resolvedLength }, () => ""),
        [resolvedLength]
    );

    const [_valueCells, setValueCells] = useUncontrolled<string[]>({
        value:
            value === undefined
                ? undefined
                : toCellArray(String(value), resolvedLength, sanitizingOptions),
        defaultValue:
            defaultValue === undefined
                ? undefined
                : toCellArray(
                      String(defaultValue),
                      resolvedLength,
                      sanitizingOptions
                  ),
        finalValue: emptyCells,
        onChange: (nextCells) => onChange?.(nextCells.join(""))
    });

    const chars = useMemo(
        () => normalizeCells(_valueCells, resolvedLength),
        [_valueCells, resolvedLength]
    );

    const charsRef = useRef(chars);
    charsRef.current = chars;

    const completedValueRef = useRef<string | null>(null);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const hasWrapper = label || description || error;
    const describedBy = error
        ? `${_id}-error`
        : description
          ? `${_id}-description`
          : undefined;

    const resolvedInputMode =
        inputMode ?? (characterSet === "numeric" ? "numeric" : "text");

    const emitValue = useCallback(
        (nextChars: string[]) => {
            setValueCells(nextChars);

            const nextValue = nextChars.join("");

            if (!nextChars.includes("")) {
                if (completedValueRef.current !== nextValue) {
                    onComplete?.(nextValue);
                    completedValueRef.current = nextValue;
                }
            } else {
                completedValueRef.current = null;
            }
        },
        [onComplete, setValueCells]
    );

    const focusCell = useCallback(
        (index: number) => {
            if (index < 0 || index >= resolvedLength) {
                return;
            }

            setTimeout(() => {
                const input = inputRefs.current[index];
                if (!input) {
                    return;
                }

                input.focus();
                input.select();
            }, 0);
        },
        [resolvedLength]
    );

    const fillFromIndex = useCallback(
        (index: number, incoming: string[]) => {
            const next = [...charsRef.current];
            let writeIndex = index;

            for (const char of incoming) {
                if (writeIndex >= resolvedLength) {
                    break;
                }

                next[writeIndex] = char;
                writeIndex += 1;
            }

            emitValue(next);

            if (writeIndex < resolvedLength) {
                focusCell(writeIndex);
                return;
            }

            focusCell(resolvedLength - 1);
        },
        [emitValue, focusCell, resolvedLength]
    );

    const handleCellChange = useCallback(
        (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled) {
                return;
            }

            const incoming = toSanitizedChars(
                event.currentTarget.value,
                sanitizingOptions
            );

            if (incoming.length === 0) {
                if (event.currentTarget.value !== "") {
                    return;
                }

                const next = [...charsRef.current];
                next[index] = "";
                emitValue(next);
                return;
            }

            if (incoming.length === 1) {
                const next = [...charsRef.current];
                next[index] = incoming[0];
                emitValue(next);

                if (index < resolvedLength - 1) {
                    focusCell(index + 1);
                }

                return;
            }

            fillFromIndex(index, incoming);
        },
        [
            disabled,
            sanitizingOptions,
            emitValue,
            resolvedLength,
            focusCell,
            fillFromIndex
        ]
    );

    const handlePaste = useCallback(
        (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
            event.preventDefault();

            if (disabled) {
                return;
            }

            const incoming = toSanitizedChars(
                event.clipboardData.getData("text"),
                sanitizingOptions
            );

            if (incoming.length === 0) {
                return;
            }

            fillFromIndex(index, incoming);
        },
        [disabled, sanitizingOptions, fillFromIndex]
    );

    const handleKeyDown = useCallback(
        (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusCell(index - 1);
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                focusCell(index + 1);
                return;
            }

            if (event.key === "Home") {
                event.preventDefault();
                focusCell(0);
                return;
            }

            if (event.key === "End") {
                event.preventDefault();
                focusCell(resolvedLength - 1);
                return;
            }

            if (event.key === "Backspace") {
                event.preventDefault();
                const next = [...charsRef.current];

                if (next[index]) {
                    next[index] = "";
                    emitValue(next);
                    return;
                }

                if (index > 0) {
                    next[index - 1] = "";
                    emitValue(next);
                    focusCell(index - 1);
                }

                return;
            }

            if (event.key === "Delete") {
                event.preventDefault();
                const next = [...charsRef.current];
                next[index] = "";
                emitValue(next);
            }
        },
        [disabled, emitValue, focusCell, resolvedLength]
    );

    const field = (
        <div
            ref={ref}
            className={cx(
                "flex w-full items-center gap-2",
                className,
                classes.root
            )}
        >
            {chars.map((char, index) => (
                <input
                    key={`${_id}-cell-${index}`}
                    {...props}
                    id={`${_id}-${index}`}
                    ref={(node) => {
                        inputRefs.current[index] = node;
                    }}
                    type={mask ? "password" : "text"}
                    inputMode={resolvedInputMode}
                    autoComplete={index === 0 ? autoComplete : "off"}
                    maxLength={resolvedLength}
                    value={char}
                    disabled={disabled}
                    required={required && index === 0}
                    placeholder={placeholder}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    aria-label={`${ariaLabelPrefix} ${index + 1} of ${resolvedLength}`}
                    className={cx(
                        "flex-none text-center font-medium tabular-nums outline-none transition-colors",
                        "focus:border-[var(--refraktor-primary)]",
                        getVariant(variant),
                        getRadius(radius),
                        CELL_SIZES[size],
                        error && "border-[var(--refraktor-colors-red-6)]",
                        disabled && "cursor-not-allowed opacity-50",
                        classes.cell
                    )}
                    onChange={(event) => handleCellChange(index, event)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={(event) => handlePaste(index, event)}
                    onFocus={(event) => event.currentTarget.select()}
                />
            ))}

            {name && <input type="hidden" name={name} value={chars.join("")} />}
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
            inputId={`${_id}-0`}
        >
            {field}
        </InputWrapper>
    );
});

PinInput.displayName = "@refraktor/core/PinInput";
PinInput.configure = createComponentConfig<PinInputProps>();
PinInput.classNames = createClassNamesConfig<PinInputClassNames>();

export default PinInput;
