import { createContext, useContext } from "react";

export type ControlOption = string | { label: string; value: string };

export type ControlDef =
    | { type: "switch"; label: string; default: boolean }
    | {
          type: "select";
          label: string;
          options: readonly ControlOption[];
          default: string;
      }
    | {
          type: "segmented";
          label: string;
          options: readonly ControlOption[];
          default: string;
      }
    | { type: "text"; label: string; default: string }
    | {
          type: "number";
          label: string;
          min?: number;
          max?: number;
          step?: number;
          default: number;
      };

export type Config = Record<string, ControlDef>;

type InferValue<D extends ControlDef> = D extends { type: "switch" }
    ? boolean
    : D extends { type: "select" }
      ? string
      : D extends { type: "segmented" }
        ? string
      : D extends { type: "text" }
        ? string
        : D extends { type: "number" }
          ? number
          : never;

export type InferProps<C extends Config> = {
    [K in keyof C]: InferValue<C[K]>;
};

export interface PlaygroundContextValue {
    props: Record<string, unknown>;
    setProps: (key: string, value: unknown) => void;
    config: Config;
    defaults: Record<string, unknown>;
    codeGenerator?: (
        props: Record<string, unknown>,
        defaults: Record<string, unknown>
    ) => string | Promise<string>;
}

export const PlaygroundContext =
    createContext<PlaygroundContextValue | null>(null);

export function usePlaygroundContext() {
    const ctx = useContext(PlaygroundContext);
    if (!ctx)
        throw new Error(
            "usePlaygroundContext must be used inside a Playground.Wrapper"
        );
    return ctx;
}
