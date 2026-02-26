import CodeBlock from "@/components/CodeBlock";
import Documentation from "@/components/Documentation";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
    IconChecklist,
    IconPackage,
    IconPlayerPlay,
    IconSparkles
} from "@tabler/icons-react";

export const Route = createFileRoute("/get-started/")({
    component: RouteComponent
});

function RouteComponent() {
    return (
        <Documentation>
            <div className="flex flex-col gap-4 pb-8 border-b border-dark-600">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-dark-600 bg-dark-800/70 px-3 py-1 text-xs font-medium text-dark-200">
                    <IconSparkles size={14} className="text-primary-400" />
                    Install Refraktor in your own project
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Get Started
                </h1>

                <p className="text-dark-200 text-base leading-relaxed max-w-3xl">
                    These setup steps are for external apps, not this monorepo.
                    They are based on the current package metadata: core depends
                    on React + utils, and dates additionally depends on dayjs.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <QuickFact text="React 18+" />
                    <QuickFact text="TypeScript-friendly" />
                    <QuickFact text="Works with Vite/Next" />
                </div>
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
                        requirements="react, react-dom, @refraktor/utils"
                    />
                    <PackageCard
                        name="@refraktor/dates"
                        icon={<IconPackage size={16} />}
                        summary="Date and time inputs/pickers that integrate with dayjs."
                        requirements="dayjs, @refraktor/core, @refraktor/utils"
                    />
                    <PackageCard
                        name="@refraktor/utils"
                        icon={<IconPackage size={16} />}
                        summary="Shared hooks and utility helpers used by Refraktor packages."
                        requirements="react"
                    />
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="install"
                title="Install packages"
                description="Pick a package manager tab and run the command set that matches your use case."
            >
                <SetupStep
                    title="Core setup (recommended)"
                    description="Use this when you need the component library."
                    icon={<IconPlayerPlay size={16} />}
                >
                    <CodeFrame>
                        <CodeBlock
                            files={[
                                {
                                    name: "npm",
                                    language: "bash",
                                    code: "npm install @refraktor/core @refraktor/utils"
                                },
                                {
                                    name: "pnpm",
                                    language: "bash",
                                    code: "pnpm add @refraktor/core @refraktor/utils"
                                },
                                {
                                    name: "yarn",
                                    language: "bash",
                                    code: "yarn add @refraktor/core @refraktor/utils"
                                },
                                {
                                    name: "bun",
                                    language: "bash",
                                    code: "bun add @refraktor/core @refraktor/utils"
                                }
                            ]}
                        />
                    </CodeFrame>
                </SetupStep>

                <SetupStep
                    title="Dates setup"
                    description="Use this when you need date/time components."
                    icon={<IconPlayerPlay size={16} />}
                >
                    <CodeFrame>
                        <CodeBlock
                            files={[
                                {
                                    name: "npm",
                                    language: "bash",
                                    code: "npm install @refraktor/dates @refraktor/core @refraktor/utils dayjs"
                                },
                                {
                                    name: "pnpm",
                                    language: "bash",
                                    code: "pnpm add @refraktor/dates @refraktor/core @refraktor/utils dayjs"
                                },
                                {
                                    name: "yarn",
                                    language: "bash",
                                    code: "yarn add @refraktor/dates @refraktor/core @refraktor/utils dayjs"
                                },
                                {
                                    name: "bun",
                                    language: "bash",
                                    code: "bun add @refraktor/dates @refraktor/core @refraktor/utils dayjs"
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

                <div className="rounded-xl border border-dark-600 bg-dark-800/60 p-4">
                    <p className="text-sm text-dark-200 leading-relaxed">
                        If you set a custom locale (for example "fr"), import
                        it first with <code>import "dayjs/locale/fr"</code>.
                    </p>
                </div>
            </Documentation.Section>

            <Documentation.Section
                id="optional-theme"
                title="Optional theme customization"
                description="You can customize colors/default radius by passing a theme config to ThemeProvider."
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
                description="Quick sanity checks after installation."
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <CheckItem text="Components render without missing-provider errors" />
                    <CheckItem text="Styles are visible (not unstyled HTML controls)" />
                    <CheckItem text="Dates render after importing the selected dayjs locale" />
                </div>
            </Documentation.Section>
        </Documentation>
    );
}

function QuickFact({ text }: { text: string }) {
    return (
        <div className="rounded-lg border border-dark-600 bg-dark-800/60 px-3 py-2 text-xs font-medium text-dark-200">
            {text}
        </div>
    );
}

interface PackageCardProps {
    name: string;
    icon: ReactNode;
    summary: string;
    requirements: string;
}

function PackageCard({ name, icon, summary, requirements }: PackageCardProps) {
    return (
        <article className="rounded-xl border border-dark-600 bg-dark-800/60 p-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-primary-400 inline-flex items-center gap-2">
                {icon}
                {name}
            </p>
            <p className="text-sm text-dark-200 leading-relaxed">{summary}</p>
            <p className="text-xs text-dark-300 leading-relaxed">
                Peer requirements: {requirements}
            </p>
        </article>
    );
}

interface SetupStepProps {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}

function SetupStep({ title, description, icon, children }: SetupStepProps) {
    return (
        <div className="rounded-xl border border-dark-600 bg-dark-800/60 p-4 flex flex-col gap-3">
            <div className="flex items-start gap-2">
                <div className="text-primary-400 mt-0.5">{icon}</div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="text-xs text-dark-200 leading-relaxed">
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
        <div className="rounded-xl border border-dark-600 overflow-hidden bg-dark-800">
            {children}
        </div>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="rounded-lg border border-dark-600 bg-dark-800/60 px-3 py-2 text-xs text-dark-200 inline-flex items-center gap-2">
            <IconChecklist size={14} className="text-primary-400 shrink-0" />
            <span>{text}</span>
        </div>
    );
}
