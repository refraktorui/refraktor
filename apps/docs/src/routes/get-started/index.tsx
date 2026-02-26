import CodeBlock from "@/components/CodeBlock";
import Documentation from "@/components/Documentation";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
    IconChecklist,
    IconCircleNumber1,
    IconCircleNumber2,
    IconCircleNumber3,
    IconClock,
    IconPackage
} from "@tabler/icons-react";

export const Route = createFileRoute("/get-started/")({
    component: RouteComponent
});

function RouteComponent() {
    return (
        <Documentation>
            <div className="flex flex-col gap-5 pb-8 border-b border-dark-700">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-dark-200">
                        <IconClock size={12} />
                        ~2 min setup
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Set up Refraktor in your project
                </h1>

                <p className="text-dark-200 text-base leading-relaxed max-w-3xl">
                    Install the packages, wrap your app with the provider, and
                    start building. These steps are for external apps — not this
                    monorepo.
                </p>
            </div>

            <Documentation.Section
                id="packages"
                title="Choose your package set"
                description="Install only what you need. Most apps start with core + utils."
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PackageCard
                        name="@refraktor/core"
                        icon={<IconPackage size={16} />}
                        summary="UI components, ThemeProvider, transitions, and theme helpers."
                    />
                    <PackageCard
                        name="@refraktor/dates"
                        icon={<IconPackage size={16} />}
                        summary="Date and time inputs/pickers that integrate with dayjs."
                    />
                    <PackageCard
                        name="@refraktor/utils"
                        icon={<IconPackage size={16} />}
                        summary="Shared hooks and utility helpers used by Refraktor packages."
                    />
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="install"
                title="Install packages"
                description="Pick a package manager tab and run the command set that matches your use case."
            >
                <SetupStep
                    step={1}
                    title="Core setup (recommended)"
                    description="Use this when you need the component library."
                    icon={<IconCircleNumber1 size={18} />}
                >
                    <CodeFrame>
                        <CodeBlock
                            files={[
                                {
                                    name: "bun",
                                    language: "bash",
                                    code: "bun add @refraktor/core @refraktor/utils"
                                },
                                {
                                    name: "npm",
                                    language: "bash",
                                    code: "npm install @refraktor/core @refraktor/utils"
                                },
                                {
                                    name: "pnpm",
                                    language: "bash",
                                    code: "pnpm add @refraktor/core @refraktor/utils"
                                }
                            ]}
                        />
                    </CodeFrame>
                </SetupStep>

                <SetupStep
                    step={2}
                    title="Dates setup (optional)"
                    description="Add this when you need date/time components."
                    icon={<IconCircleNumber2 size={18} />}
                >
                    <CodeFrame>
                        <CodeBlock
                            files={[
                                {
                                    name: "bun",
                                    language: "bash",
                                    code: "bun add @refraktor/dates @refraktor/core @refraktor/utils dayjs"
                                },
                                {
                                    name: "npm",
                                    language: "bash",
                                    code: "npm install @refraktor/dates @refraktor/core @refraktor/utils dayjs"
                                },
                                {
                                    name: "pnpm",
                                    language: "bash",
                                    code: "pnpm add @refraktor/dates @refraktor/core @refraktor/utils dayjs"
                                }
                            ]}
                        />
                    </CodeFrame>
                </SetupStep>
            </Documentation.Section>

            <Documentation.Section
                id="theme-provider"
                title="Wire providers in your app"
                description="Wrap your app with ThemeProvider at the root so all core components receive theme context."
            >
                <SetupStep
                    step={3}
                    title="Add ThemeProvider"
                    description="This gives every Refraktor component access to your theme tokens."
                    icon={<IconCircleNumber3 size={18} />}
                >
                    <CodeFrame>
                        <CodeBlock
                            files={[
                                {
                                    name: "src/main.tsx",
                                    language: "tsx",
                                    code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@refraktor/core";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);`
                                },
                                {
                                    name: "src/App.tsx",
                                    language: "tsx",
                                    code: `import { Button } from "@refraktor/core";

export default function App() {
  return (
    <main style={{ padding: 24 }}>
      <Button variant="filled">Build with Refraktor</Button>
    </main>
  );
}`
                                }
                            ]}
                        />
                    </CodeFrame>
                </SetupStep>
            </Documentation.Section>

            <Documentation.Section
                id="dates-provider"
                title="Dates package setup"
                description="When using @refraktor/dates, import a dayjs locale and wrap date components with DatesProvider."
            >
                <CodeFrame>
                    <CodeBlock
                        filename="src/main.tsx"
                        language="tsx"
                        code={`import "dayjs/locale/en";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@refraktor/core";
import { DateInput, DatesProvider } from "@refraktor/dates";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DatesProvider locale="en">
        <DateInput label="Choose date" />
      </DatesProvider>
    </ThemeProvider>
  </StrictMode>
);`}
                    />
                </CodeFrame>

                <div className="rounded-xl border border-dark-600 bg-dark-800/60 p-4 flex items-start gap-3">
                    <p className="text-sm text-dark-200 leading-relaxed">
                        If you set a custom locale (for example{" "}
                        <code className="text-primary-400">"fr"</code>), import
                        it first with{" "}
                        <code className="text-primary-400">
                            import "dayjs/locale/fr"
                        </code>
                        .
                    </p>
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="optional-theme"
                title="Optional theme customization"
                description="Customize colors and default radius by passing a theme config to ThemeProvider."
            >
                <CodeFrame>
                    <CodeBlock
                        filename="src/main.tsx"
                        language="tsx"
                        code={`import { ThemeProvider, createTheme } from "@refraktor/core";

const theme = createTheme({
  defaults: {
    radius: "lg"
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider themeConfig={theme}>{children}</ThemeProvider>;
}`}
                    />
                </CodeFrame>
            </Documentation.Section>

            <Documentation.Section
                id="verify"
                title="Verify your setup"
                description="Quick sanity checks — if all three pass, you're good to go."
            >
                <div className="grid grid-cols-1 gap-2">
                    <CheckItem text="Components render without missing-provider errors" />
                    <CheckItem text="Styles are visible (not unstyled HTML controls)" />
                    <CheckItem text="Dates render after importing the selected dayjs locale" />
                </div>

                <div
                    className="rounded-xl border border-dark-600 p-5 text-center mt-2"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(59, 130, 246, 0.04), transparent 60%), var(--color-dark-800)"
                    }}
                >
                    <p className="text-sm text-dark-100 font-medium">
                        All checks passing? You're ready to build.
                    </p>
                    <p className="text-xs text-dark-300 mt-1">
                        Explore the component docs in the sidebar to see what's
                        available.
                    </p>
                </div>
            </Documentation.Section>
        </Documentation>
    );
}

interface PackageCardProps {
    name: string;
    icon: ReactNode;
    summary: string;
}

function PackageCard({ name, icon, summary }: PackageCardProps) {
    return (
        <article className="group rounded-xl border border-dark-700 bg-dark-800/60 p-5 flex flex-col gap-3 transition-all duration-300 hover:border-dark-500 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.08)]">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-400 inline-flex items-center gap-2">
                    {icon}
                    {name}
                </p>
            </div>
            <p className="text-sm text-dark-200 leading-relaxed flex-1">
                {summary}
            </p>
        </article>
    );
}

interface SetupStepProps {
    step: number;
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}

function SetupStep({ title, description, icon, children }: SetupStepProps) {
    return (
        <div className="rounded-xl border border-dark-700 bg-dark-800/60 p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
                    {icon}
                </div>
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-semibold text-white">
                        {title}
                    </h3>
                    <p className="text-xs text-dark-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </div>
    );
}

function CodeFrame({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border border-dark-700 overflow-hidden bg-dark-900">
            {children}
        </div>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="rounded-lg border border-dark-700 bg-dark-800/60 px-4 py-3 text-sm text-dark-100 inline-flex items-center gap-3 transition-colors hover:border-dark-600">
            <div className="w-5 h-5 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                <IconChecklist
                    size={12}
                    className="text-primary-400 shrink-0"
                />
            </div>
            <span>{text}</span>
        </div>
    );
}
