import {
    Children,
    createContext,
    createElement,
    isValidElement,
    useContext,
    useState,
    type ReactNode
} from "react";
import {
    Input,
    NumberInput as CoreNumberInput,
    Select,
    SegmentedControl,
    Switch
} from "@refraktor/core";
import PlaygroundPreview from "./PlaygroundPreview";
import PlaygroundControls from "./PlaygroundControls";
import PlaygroundControl from "./PlaygroundControl";
import PlaygroundCode from "./PlaygroundCode";
import type {
    Config,
    ControlOption,
    ControlDef,
    InferProps,
    PlaygroundContextValue
} from "./PlaygroundContext";

// ─── Control input widgets ────────────────────────────────────────────────────

function SwitchInput({
    label,
    value,
    onChange
}: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return createElement(Switch, {
        label,
        checked: value,
        onChange: (event) => onChange(event.currentTarget.checked),
        classNames: {
            label: "text-xs"
        }
    });
}

function SelectInput({
    value,
    options,
    onChange
}: {
    value: string;
    options: readonly ControlOption[];
    onChange: (v: string) => void;
}) {
    return createElement(Select, {
        value,
        onChange: (nextValue) => {
            if (nextValue !== null) {
                onChange(nextValue);
            }
        },
        data: normalizeControlOptions(options),
        className: "w-full"
    });
}

function SegmentedInput({
    value,
    options,
    onChange
}: {
    value: string;
    options: readonly ControlOption[];
    onChange: (v: string) => void;
}) {
    return createElement(SegmentedControl, {
        fullWidth: true,
        value,
        onChange,
        data: normalizeControlOptions(options)
    });
}

function normalizeControlOptions(options: readonly ControlOption[]) {
    return options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
    );
}

function TextInput({
    value,
    onChange
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return createElement(Input, {
        value,
        onChange: (event) => onChange(event.target.value),
        className: "w-full"
    });
}

function NumberInput({
    value,
    min,
    max,
    step,
    onChange
}: {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (v: number) => void;
}) {
    return createElement(CoreNumberInput, {
        value,
        min,
        max,
        step: step ?? 1,
        onChange: (nextValue) => {
            const parsed =
                typeof nextValue === "number" ? nextValue : Number(nextValue);

            if (!Number.isNaN(parsed)) {
                onChange(parsed);
            }
        },
        className: "w-full"
    });
}

// ─── Auto Controls renderer ───────────────────────────────────────────────────

function renderControlInput(
    key: string,
    def: ControlDef,
    value: unknown,
    setProps: (k: string, v: unknown) => void
): ReactNode {
    switch (def.type) {
        case "switch":
            return createElement(SwitchInput, {
                key,
                label: def.label,
                value: value as boolean,
                onChange: (v) => setProps(key, v)
            });
        case "select":
            return createElement(SelectInput, {
                key,
                value: value as string,
                options: def.options,
                onChange: (v) => setProps(key, v)
            });
        case "segmented":
            return createElement(SegmentedInput, {
                key,
                value: value as string,
                options: def.options,
                onChange: (v) => setProps(key, v)
            });
        case "text":
            return createElement(TextInput, {
                key,
                value: value as string,
                onChange: (v) => setProps(key, v)
            });
        case "number":
            return createElement(NumberInput, {
                key,
                value: value as number,
                min: def.min,
                max: def.max,
                step: def.step,
                onChange: (v) => setProps(key, v)
            });
    }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createPlayground<C extends Config>(config: C) {
    type Props = InferProps<C>;

    const Ctx = createContext<PlaygroundContextValue | null>(null);

    function useCtx() {
        const ctx = useContext(Ctx);
        if (!ctx)
            throw new Error(
                "Playground sub-components must be used inside the Wrapper returned by createPlayground"
            );
        return ctx;
    }

    function Wrapper({ children }: { children: ReactNode }) {
        const defaults = Object.fromEntries(
            Object.entries(config).map(([k, v]) => [k, v.default])
        );
        const [state, setState] = useState<Record<string, unknown>>(defaults);

        function setProps(key: string, value: unknown) {
            setState((prev) => ({ ...prev, [key]: value }));
        }

        const childArray = Children.toArray(children).filter(isValidElement);
        const previewEl = childArray.find((c) => c.type === Preview) ?? null;
        const controlsEl = childArray.find((c) => c.type === Controls) ?? null;
        const otherEls = childArray.filter(
            (c) => c.type !== Preview && c.type !== Controls
        );

        return createElement(
            Ctx.Provider,
            { value: { props: state, setProps, config } },
            createElement(
                "div",
                {
                    className:
                        "rounded-xl border border-dark-600 overflow-hidden bg-dark-800 [&>*+*]:border-t [&>*+*]:border-dark-600"
                },
                // Preview + Controls: side-by-side on desktop, stacked on mobile
                createElement(
                    "div",
                    { className: "flex flex-col lg:flex-row" },
                    // Preview stretches to fill available space
                    previewEl &&
                        createElement(
                            "div",
                            { className: "flex-1" },
                            previewEl
                        ),
                    // Controls: fixed width on desktop with a dividing border
                    controlsEl &&
                        createElement(
                            "div",
                            {
                                className:
                                    "border-t border-dark-600 lg:border-t-0 lg:border-l lg:w-72 lg:shrink-0 lg:overflow-y-auto"
                            },
                            controlsEl
                        )
                ),
                // Code and any other children go full-width below
                ...otherEls
            )
        );
    }

    function Preview({ children }: { children: (props: Props) => ReactNode }) {
        const { props } = useCtx();
        return createElement(PlaygroundPreview, null, children(props as Props));
    }

    function Controls() {
        const { config: cfg, props, setProps } = useCtx();
        const rows = Object.entries(cfg).map(([key, def]) =>
            createElement(PlaygroundControl, {
                key,
                label: def.label,
                hideLabel: def.type === "switch",
                children: renderControlInput(key, def, props[key], setProps)
            })
        );
        return createElement(PlaygroundControls, null, ...rows);
    }

    return {
        Wrapper,
        Preview,
        Controls,
        Code: PlaygroundCode
    };
}
