import CodeBlock from "@/components/CodeBlock";
import Documentation from "@/components/Documentation";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
    IconBrush,
    IconDeviceFloppy,
    IconCircleFilled,
    IconBorderRadius,
    IconSun,
    IconMoon
} from "@tabler/icons-react";
import { useTheme } from "@refraktor/core";

export const Route = createFileRoute("/theming/")({
    component: RouteComponent
});

const RADIUS_VALUES = [
    "none",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "full"
] as const;

const RADIUS_PREVIEW: Record<string, string> = {
    none: "0px",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "24px",
    full: "9999px"
};

const PRIMARY_COLORS = [
    "gray",
    "cloud",
    "green",
    "mint",
    "red",
    "blue",
    "cyan",
    "teal",
    "yellow",
    "orange",
    "purple",
    "magenta",
    "pink"
] as const;

type PrimaryColorName = (typeof PRIMARY_COLORS)[number];

function RouteComponent() {
    return (
        <Documentation>
            <div className="flex flex-col gap-5 pb-8 border-b border-dark-700">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Customize your theme
                </h1>

                <p className="text-dark-200 text-base leading-relaxed max-w-3xl">
                    Refraktor ships with a flexible theming system built on CSS
                    variables and React context. Configure colors, radius, and
                    component defaults through{" "}
                    <code className="text-primary-400 text-sm bg-dark-700/60 px-1.5 py-0.5 rounded">
                        createTheme
                    </code>{" "}
                    and pass the result to{" "}
                    <code className="text-primary-400 text-sm bg-dark-700/60 px-1.5 py-0.5 rounded">
                        ThemeProvider
                    </code>
                    .
                </p>
            </div>

            <Documentation.Section
                id="create-theme"
                title="Creating a theme"
                description="Use createTheme to build a config object. It merges your overrides with sensible defaults."
            >
                <CodeFrame>
                    <CodeBlock
                        files={[
                            {
                                name: "Basic",
                                language: "tsx",
                                code: `import { createTheme, ThemeProvider } from "@refraktor/core";

const theme = createTheme({
  defaults: {
    radius: "lg",
    primaryColor: "blue",
    primaryShade: 5,
    autoContrast: true
  }
});

function App() {
  return (
    <ThemeProvider themeConfig={theme}>
      {/* your app */}
    </ThemeProvider>
  );
}`
                            },
                            {
                                name: "Custom colors",
                                language: "tsx",
                                code: `import { createTheme, ThemeProvider } from "@refraktor/core";

const theme = createTheme({
  defaults: {
    primaryColor: "brand",
    primaryShade: 6
  },
  colors: {
    brand: [
      "#f0f4ff", "#dbe4ff", "#bac8ff",
      "#91a7ff", "#748ffc", "#5c7cfa",
      "#4c6ef5", "#4263eb", "#3b5bdb",
      "#364fc7"
    ]
  }
});

function App() {
  return (
    <ThemeProvider themeConfig={theme}>
      {/* components now use your brand palette */}
    </ThemeProvider>
  );
}`
                            }
                        ]}
                    />
                </CodeFrame>
            </Documentation.Section>

            <Documentation.Section
                id="defaults"
                title="Theme defaults"
                description="These settings control the global look and feel of every component."
            >
                <div className="overflow-hidden rounded-xl border border-dark-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700 bg-dark-800/80">
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Property
                                </th>
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Type
                                </th>
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Default
                                </th>
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/60">
                            <PropRow
                                name="radius"
                                type="RefraktorRadius"
                                defaultVal='"md"'
                                description="Default border-radius applied to all components"
                            />
                            <PropRow
                                name="primaryColor"
                                type="PrimaryColor | string"
                                defaultVal='"cloud"'
                                description="Primary color key used for filled variants and accents"
                            />
                            <PropRow
                                name="primaryShade"
                                type="0–9"
                                defaultVal="5"
                                description="Which shade index of the primary color to use"
                            />
                            <PropRow
                                name="autoContrast"
                                type="boolean"
                                defaultVal="true"
                                description="Automatically pick readable text on the primary color"
                            />
                        </tbody>
                    </table>
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="color-palette"
                title="Built-in color palette"
                description="Refraktor includes 13 hand-tuned color scales, each with 10 shades (0–9). Every scale is available as CSS variables."
            >
                <ColorPalette />
            </Documentation.Section>

            <Documentation.Section
                id="primary-color"
                title="Primary color preview"
                description="See how each built-in color looks as the primary. The filled swatch shows the shade at index 5."
            >
                <PrimaryColorPicker />
            </Documentation.Section>

            <Documentation.Section
                id="radius"
                title="Radius scale"
                description="Components accept a radius prop. When set to 'default', the theme's radius setting is used."
            >
                <RadiusShowcase />
            </Documentation.Section>

            <Documentation.Section
                id="semantic-tokens"
                title="Semantic color tokens"
                description="ThemeProvider generates semantic tokens that automatically flip between light and dark mode."
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TokenGroup
                        title="Backgrounds"
                        icon={<IconSun size={14} />}
                        tokens={[
                            {
                                name: "--refraktor-bg",
                                label: "Surface background"
                            },
                            {
                                name: "--refraktor-bg-hover",
                                label: "Hovered surface"
                            },
                            {
                                name: "--refraktor-bg-subtle",
                                label: "Subtle / muted surface"
                            },
                            {
                                name: "--refraktor-bg-elevated",
                                label: "Elevated card / popover"
                            }
                        ]}
                    />
                    <TokenGroup
                        title="Text"
                        icon={<IconBrush size={14} />}
                        tokens={[
                            {
                                name: "--refraktor-text",
                                label: "Primary text"
                            },
                            {
                                name: "--refraktor-text-secondary",
                                label: "Secondary text"
                            },
                            {
                                name: "--refraktor-text-tertiary",
                                label: "Tertiary / hint text"
                            }
                        ]}
                    />
                    <TokenGroup
                        title="Borders"
                        icon={<IconBorderRadius size={14} />}
                        tokens={[
                            {
                                name: "--refraktor-border",
                                label: "Default border"
                            },
                            {
                                name: "--refraktor-border-hover",
                                label: "Hovered border"
                            }
                        ]}
                    />
                    <TokenGroup
                        title="Primary"
                        icon={<IconCircleFilled size={14} />}
                        tokens={[
                            {
                                name: "--refraktor-primary",
                                label: "Primary accent"
                            },
                            {
                                name: "--refraktor-primary-hover",
                                label: "Primary hover"
                            },
                            {
                                name: "--refraktor-primary-text",
                                label: "Text on primary"
                            }
                        ]}
                    />
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="dark-light"
                title="Dark and light mode"
                description="ThemeProvider manages the active theme and sets a data-refraktor-theme attribute on the root element. Use setTheme or toggleTheme from useTheme()."
            >
                <CodeFrame>
                    <CodeBlock
                        files={[
                            {
                                name: "Toggle",
                                language: "tsx",
                                code: `import { useTheme, Button } from "@refraktor/core";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="outline">
      {theme === "dark" ? "Switch to light" : "Switch to dark"}
    </Button>
  );
}`
                            },
                            {
                                name: "Set explicitly",
                                language: "tsx",
                                code: `import { useTheme } from "@refraktor/core";

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => setTheme("light")}
        style={{ fontWeight: theme === "light" ? 700 : 400 }}
      >
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        style={{ fontWeight: theme === "dark" ? 700 : 400 }}
      >
        Dark
      </button>
    </div>
  );
}`
                            }
                        ]}
                    />
                </CodeFrame>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ModeCard mode="dark" icon={<IconMoon size={16} />} />
                    <ModeCard mode="light" icon={<IconSun size={16} />} />
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="persistence"
                title="Theme persistence"
                description="Opt into localStorage persistence so the user's preferred theme survives page reloads."
            >
                <CodeFrame>
                    <CodeBlock
                        files={[
                            {
                                name: "Enable persistence",
                                language: "tsx",
                                code: `<ThemeProvider
  persistence={{ enabled: true }}
>
  <App />
</ThemeProvider>`
                            },
                            {
                                name: "Custom storage key",
                                language: "tsx",
                                code: `<ThemeProvider
  persistence={{
    enabled: true,
    storageKey: "my-app-theme"
  }}
>
  <App />
</ThemeProvider>`
                            }
                        ]}
                    />
                </CodeFrame>

                <div className="rounded-xl border border-dark-700 bg-dark-800/60 p-5 flex items-start gap-3">
                    <IconDeviceFloppy
                        size={18}
                        className="text-primary-400 shrink-0 mt-0.5"
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-white">
                            How it works
                        </p>
                        <p className="text-sm text-dark-200 leading-relaxed">
                            When persistence is enabled, ThemeProvider reads the
                            stored theme on mount and writes back on every
                            change. The default key is{" "}
                            <code className="text-primary-400 text-xs bg-dark-700/60 px-1.5 py-0.5 rounded">
                                refraktor-theme
                            </code>
                            . Pass a custom{" "}
                            <code className="text-primary-400 text-xs bg-dark-700/60 px-1.5 py-0.5 rounded">
                                storageKey
                            </code>{" "}
                            if you have multiple Refraktor apps on the same
                            domain.
                        </p>
                    </div>
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="component-config"
                title="Component-level defaults"
                description="The components prop lets you set default props and classNames for any Refraktor component across your entire app."
            >
                <CodeFrame>
                    <CodeBlock
                        filename="src/theme.ts"
                        language="tsx"
                        code={`import { createTheme, ThemeProvider } from "@refraktor/core";

const theme = createTheme({
  defaults: { radius: "lg", primaryColor: "blue" }
});

function App() {
  return (
    <ThemeProvider
      themeConfig={theme}
      components={{
        Button: {
          defaultProps: {
            variant: "outline",
            radius: "xl"
          },
          classNames: {
            root: "font-semibold tracking-wide"
          }
        },
        Input: {
          defaultProps: {
            radius: "lg"
          }
        }
      }}
    >
      {/* All Buttons now default to outline + xl radius */}
    </ThemeProvider>
  );
}`}
                    />
                </CodeFrame>
            </Documentation.Section>

            <Documentation.Section
                id="use-theme"
                title="useTheme hook"
                description="Access the full theme context from any component inside ThemeProvider."
            >
                <CodeFrame>
                    <CodeBlock
                        filename="useTheme returns"
                        language="tsx"
                        code={`const {
  theme,       // "dark" | "light"
  setTheme,    // (theme: Theme) => void
  toggleTheme, // () => void
  getRadius,   // (radius?: RefraktorRadius) => string (Tailwind class)
  colors,      // full ColorsConfig object
  cx           // className merge utility
} = useTheme();`}
                    />
                </CodeFrame>

                <CodeFrame>
                    <CodeBlock
                        filename="Example usage"
                        language="tsx"
                        code={`import { useTheme } from "@refraktor/core";

function DynamicCard() {
  const { theme, getRadius, colors } = useTheme();

  return (
    <div
      className={cx(
        "p-6 border transition-colors",
        getRadius("lg"),
        theme === "dark"
          ? "bg-neutral-900 border-neutral-700"
          : "bg-white border-neutral-200"
      )}
    >
      <p>Current theme: {theme}</p>
    </div>
  );
}`}
                    />
                </CodeFrame>
            </Documentation.Section>

            <Documentation.Section
                id="provider-props"
                title="ThemeProvider props"
                description="Full reference for all props accepted by ThemeProvider."
            >
                <div className="overflow-hidden rounded-xl border border-dark-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700 bg-dark-800/80">
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Prop
                                </th>
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Type
                                </th>
                                <th className="text-left px-5 py-3 text-dark-100 font-medium">
                                    Default
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/60">
                            <ProviderPropRow
                                name="children"
                                type="ReactNode"
                                defaultVal="—"
                            />
                            <ProviderPropRow
                                name="theme"
                                type='"dark" | "light"'
                                defaultVal='"dark"'
                            />
                            <ProviderPropRow
                                name="themeConfig"
                                type="RefraktorTheme"
                                defaultVal="defaultTheme"
                            />
                            <ProviderPropRow
                                name="components"
                                type="ComponentsConfig"
                                defaultVal="{}"
                            />
                            <ProviderPropRow
                                name="persistence"
                                type="ThemePersistenceOptions"
                                defaultVal="{ enabled: false }"
                            />
                        </tbody>
                    </table>
                </div>
            </Documentation.Section>
        </Documentation>
    );
}

function CodeFrame({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border border-dark-700 overflow-hidden bg-dark-900">
            {children}
        </div>
    );
}

function PropRow({
    name,
    type,
    defaultVal,
    description
}: {
    name: string;
    type: string;
    defaultVal: string;
    description: string;
}) {
    return (
        <tr className="bg-dark-800/40 hover:bg-dark-800/70 transition-colors">
            <td className="px-5 py-3">
                <code className="text-primary-400 text-xs bg-dark-700/60 px-1.5 py-0.5 rounded">
                    {name}
                </code>
            </td>
            <td className="px-5 py-3 text-dark-100 font-mono text-xs">
                {type}
            </td>
            <td className="px-5 py-3 text-dark-200 font-mono text-xs">
                {defaultVal}
            </td>
            <td className="px-5 py-3 text-dark-200">{description}</td>
        </tr>
    );
}

function ProviderPropRow({
    name,
    type,
    defaultVal
}: {
    name: string;
    type: string;
    defaultVal: string;
}) {
    return (
        <tr className="bg-dark-800/40 hover:bg-dark-800/70 transition-colors">
            <td className="px-5 py-3">
                <code className="text-primary-400 text-xs bg-dark-700/60 px-1.5 py-0.5 rounded">
                    {name}
                </code>
            </td>
            <td className="px-5 py-3 text-dark-100 font-mono text-xs">
                {type}
            </td>
            <td className="px-5 py-3 text-dark-200 font-mono text-xs">
                {defaultVal}
            </td>
        </tr>
    );
}

const PALETTE_COLORS = [
    "gray",
    "cloud",
    "green",
    "mint",
    "red",
    "blue",
    "cyan",
    "teal",
    "yellow",
    "orange",
    "purple",
    "magenta",
    "pink"
] as const;

function ColorPalette() {
    const { colors } = useTheme();

    const defaultColors = colors as any;

    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const [hoveredShade, setHoveredShade] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-3">
            <div className="overflow-x-auto rounded-xl border border-dark-700 bg-dark-800/40 p-4">
                <div className="min-w-[640px]">
                    <div className="grid grid-cols-[80px_repeat(10,1fr)] gap-1.5 mb-2">
                        <div />
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={i}
                                className="text-center text-[10px] font-mono text-dark-300"
                            >
                                {i}
                            </div>
                        ))}
                    </div>

                    {PALETTE_COLORS.map((color) => {
                        const scale = defaultColors[color];
                        if (!Array.isArray(scale)) return null;

                        return (
                            <div
                                key={color}
                                className="grid grid-cols-[80px_repeat(10,1fr)] gap-1.5 mb-1.5"
                            >
                                <div className="flex items-center text-xs font-medium text-dark-100 capitalize">
                                    {color}
                                </div>
                                {scale.map((hex, i) => (
                                    <div
                                        key={i}
                                        className="relative group/swatch"
                                        onMouseEnter={() => {
                                            setHoveredColor(color);
                                            setHoveredShade(i);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredColor(null);
                                            setHoveredShade(null);
                                        }}
                                    >
                                        <div
                                            className="h-8 rounded-md transition-all duration-150 cursor-pointer ring-0 group-hover/swatch:ring-2 group-hover/swatch:ring-white/30 group-hover/swatch:scale-110 group-hover/swatch:z-10"
                                            style={{
                                                backgroundColor: hex
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {hoveredColor && hoveredShade !== null && (
                <div className="flex items-center gap-3 text-xs text-dark-200 px-1 h-5 animate-in fade-in duration-150">
                    <div
                        className="w-4 h-4 rounded-sm border border-dark-600"
                        style={{
                            backgroundColor: (
                                defaultColors[hoveredColor] as string[]
                            )[hoveredShade]
                        }}
                    />
                    <span className="font-mono text-dark-100">
                        --refraktor-colors-{hoveredColor}-{hoveredShade}
                    </span>
                    <span className="font-mono text-dark-300">
                        {
                            (defaultColors[hoveredColor] as string[])[
                                hoveredShade
                            ]
                        }
                    </span>
                </div>
            )}
            {!hoveredColor && (
                <div className="flex items-center text-xs text-dark-300 px-1 h-5">
                    Hover over a swatch to see its variable name and hex value
                </div>
            )}
        </div>
    );
}

function PrimaryColorPicker() {
    const { colors } = useTheme();

    const [selected, setSelected] = useState<PrimaryColorName>("cloud");

    const defaultColors = colors as any;
    const scale = defaultColors[selected];
    const primaryHex = Array.isArray(scale) ? scale[5] : scale;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {PRIMARY_COLORS.map((color) => {
                    const s = defaultColors[color];
                    const hex = Array.isArray(s) ? s[5] : s;

                    return (
                        <button
                            key={color}
                            onClick={() => setSelected(color)}
                            className={`
                                group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer
                                ${
                                    selected === color
                                        ? "border-white/20 bg-dark-700 text-white"
                                        : "border-dark-700 bg-dark-800/40 text-dark-200 hover:border-dark-500 hover:text-white"
                                }
                            `}
                        >
                            <div
                                className="w-3 h-3 rounded-full ring-1 ring-inset ring-white/10"
                                style={{ backgroundColor: hex }}
                            />
                            <span className="capitalize">{color}</span>
                        </button>
                    );
                })}
            </div>

            <div className="rounded-xl border border-dark-700 bg-dark-800/60 p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-xl shadow-lg ring-1 ring-inset ring-white/10"
                        style={{ backgroundColor: primaryHex }}
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-white font-semibold capitalize text-lg">
                            {selected}
                        </p>
                        <p className="text-dark-300 font-mono text-xs">
                            primaryColor: "{selected}" · primaryShade: 5 ·{" "}
                            {primaryHex}
                        </p>
                    </div>
                </div>

                {Array.isArray(scale) && (
                    <div className="grid grid-cols-10 gap-1.5">
                        {scale.map((hex, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-1.5"
                            >
                                <div
                                    className={`w-full aspect-square rounded-lg transition-all ${i === 5 ? "ring-2 ring-white/40 scale-105" : "ring-1 ring-white/5"}`}
                                    style={{ backgroundColor: hex }}
                                />
                                <span className="text-[10px] font-mono text-dark-300">
                                    {i}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <CodeFrame>
                    <CodeBlock
                        filename="theme.ts"
                        language="tsx"
                        code={`const theme = createTheme({
  defaults: {
    primaryColor: "${selected}",
    primaryShade: 5
  }
});`}
                    />
                </CodeFrame>
            </div>
        </div>
    );
}

function RadiusShowcase() {
    const [selected, setSelected] = useState<string>("md");

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {RADIUS_VALUES.map((r) => (
                    <button
                        key={r}
                        onClick={() => setSelected(r)}
                        className={`
                            px-3 py-1.5 text-xs font-mono transition-all cursor-pointer
                            ${
                                selected === r
                                    ? "border-white/20 bg-dark-700 text-white"
                                    : "border-dark-700 bg-dark-800/40 text-dark-200 hover:border-dark-500 hover:text-white"
                            }
                        `}
                        style={{
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderRadius: RADIUS_PREVIEW[r]
                        }}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <div className="rounded-xl border border-dark-700 bg-dark-800/60 p-6 flex flex-col sm:flex-row items-center gap-8">
                <div className="flex items-center gap-6">
                    <div
                        className="w-24 h-24 bg-primary-500/20 border-2 border-primary-400/40 transition-all duration-300"
                        style={{ borderRadius: RADIUS_PREVIEW[selected] }}
                    />
                    <div
                        className="w-48 h-12 bg-primary-500/20 border-2 border-primary-400/40 transition-all duration-300"
                        style={{ borderRadius: RADIUS_PREVIEW[selected] }}
                    />
                </div>
                <div className="flex flex-col gap-1 text-sm">
                    <p className="text-white font-medium font-mono">
                        radius: "{selected}"
                    </p>
                    <p className="text-dark-300 font-mono text-xs">
                        {RADIUS_PREVIEW[selected]}
                    </p>
                </div>
            </div>
        </div>
    );
}

function TokenGroup({
    title,
    icon,
    tokens
}: {
    title: string;
    icon: ReactNode;
    tokens: { name: string; label: string }[];
}) {
    return (
        <div className="rounded-xl border border-dark-700 bg-dark-800/60 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-dark-100">
                <span className="text-primary-400">{icon}</span>
                {title}
            </div>
            <div className="flex flex-col gap-2">
                {tokens.map((t) => (
                    <div
                        key={t.name}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-dark-900/60 border border-dark-700/60"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div
                                className="w-4 h-4 rounded-sm shrink-0 ring-1 ring-inset ring-white/10"
                                style={{
                                    backgroundColor: `var(${t.name})`
                                }}
                            />
                            <span className="text-[11px] font-mono text-dark-100 truncate">
                                {t.name}
                            </span>
                        </div>
                        <span className="text-[10px] text-dark-300 shrink-0">
                            {t.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ModeCard({ mode, icon }: { mode: "dark" | "light"; icon: ReactNode }) {
    const isDark = mode === "dark";

    return (
        <div
            className={`rounded-xl border p-5 flex flex-col gap-3 transition-all ${
                isDark
                    ? "border-dark-600 bg-dark-800/80"
                    : "border-dark-500 bg-dark-700/60"
            }`}
        >
            <div className="flex items-center gap-2">
                <span className="text-primary-400">{icon}</span>
                <span className="text-sm font-semibold text-white capitalize">
                    {mode} mode
                </span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs font-mono text-dark-200">
                <span>bg: {isDark ? "dark-6" : "light-2"}</span>
                <span>text: {isDark ? "white" : "black"}</span>
                <span>border: {isDark ? "dark-4" : "light-4"}</span>
            </div>
            <div className="flex gap-2 mt-1">
                {(isDark
                    ? ["#2e2e2e", "#3b3b3b", "#424242", "#696969"]
                    : ["#f2f2f2", "#e5e5e5", "#d1d1d1", "#b2b2b2"]
                ).map((hex) => (
                    <div
                        key={hex}
                        className="flex-1 h-6 rounded-md ring-1 ring-inset ring-white/5"
                        style={{ backgroundColor: hex }}
                    />
                ))}
            </div>
        </div>
    );
}
