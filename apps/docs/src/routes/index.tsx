import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    Accordion,
    Button,
    Progress,
    SegmentedControl,
    Slider,
    Switch,
    Tabs,
    Transition
} from "@refraktor/core";
import { type ReactNode, useState } from "react";
import {
    IconArrowRight,
    IconBolt,
    IconBraces,
    IconBrandGithub,
    IconPalette,
    IconShieldCheck
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({
    component: HomePage
});

function HomePage() {
    return (
        <div className="-mx-4 -mt-4 overflow-x-hidden">
            <HeroSection />
            <StatsStrip />
            <ShowcaseSection />
            <FeaturesSection />
            <CTASection />
        </div>
    );
}

function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-6 py-24 overflow-hidden">
            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8">
                <Transition mounted transition="slide-up" duration={500}>
                    <div className="flex flex-col items-center">
                        <h1
                            className="text-6xl md:text-8xl font-black tracking-tight text-white"
                            style={{ lineHeight: 0.9 }}
                        >
                            Craft. Ship.
                        </h1>
                        <h1
                            className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text"
                            style={{
                                lineHeight: 1.1,
                                backgroundImage:
                                    "linear-gradient(135deg, var(--color-primary-300), var(--color-primary-500))"
                            }}
                        >
                            Refraktor.
                        </h1>
                    </div>
                </Transition>

                <Transition
                    mounted
                    transition="slide-up"
                    duration={500}
                    delay={100}
                >
                    {/* Tagline */}
                    <p className="text-lg md:text-xl text-dark-200 max-w-2xl leading-relaxed">
                        A modern React component library. 30+ accessible,
                        TypeScript-first components built on Tailwind CSS v4.
                    </p>
                </Transition>

                {/* CTA buttons */}
                <Transition
                    mounted
                    transition="slide-up"
                    duration={500}
                    delay={200}
                >
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button
                            variant="filled"
                            size="lg"
                            rightSection={<IconArrowRight size={16} />}
                            onClick={() => navigate({ to: "/get-started" })}
                        >
                            Get Started
                        </Button>
                        <Button
                            as="a"
                            href="https://github.com/refraktorui/refraktor"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            size="lg"
                            leftSection={<IconBrandGithub size={16} />}
                        >
                            GitHub
                        </Button>
                    </div>
                </Transition>
            </div>
        </section>
    );
}

function StatsStrip() {
    const stats = [
        { value: "30+", label: "Components" },
        { value: "v4", label: "Tailwind" },
        { value: "100%", label: "TypeScript" },
        { value: "ARIA", label: "Accessible" }
    ];

    return (
        <div className="border-y border-dark-700 bg-dark-800/40">
            <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-10 md:gap-20">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex flex-col items-center gap-1"
                    >
                        <span className="text-2xl font-bold text-white">
                            {stat.value}
                        </span>
                        <span className="text-xs text-dark-200 uppercase tracking-widest font-medium">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ShowcaseSection() {
    return (
        <section className="px-6 py-20">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Everything you need
                    </h2>
                    <p className="text-dark-200 max-w-xl mx-auto">
                        Handcrafted components that are beautiful, accessible,
                        and a joy to use.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AccordionShowcase />
                    <ControlsShowcase />
                    <ProgressShowcase />
                    <TabsShowcase />
                </div>
            </div>
        </section>
    );
}

function AccordionShowcase() {
    return (
        <ShowcaseCard
            title="Accordion"
            description="Collapsible sections for structured content and FAQs."
        >
            <Accordion defaultValue="accessible" collapsible>
                <Accordion.Item value="accessible">
                    <Accordion.Control>
                        Is Refraktor accessible?
                    </Accordion.Control>
                    <Accordion.Panel>
                        Yes — every component ships with full ARIA attributes
                        and keyboard navigation support out of the box.
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="typescript">
                    <Accordion.Control>
                        Does it have TypeScript support?
                    </Accordion.Control>
                    <Accordion.Panel>
                        Refraktor is built entirely in TypeScript. All props,
                        events, and refs are fully typed.
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="styling">
                    <Accordion.Control>
                        How do I customize styles?
                    </Accordion.Control>
                    <Accordion.Panel>
                        Use the{" "}
                        <code className="text-primary-400">classNames</code> API
                        to target individual parts, or pass a{" "}
                        <code className="text-primary-400">className</code> to
                        override the root.
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </ShowcaseCard>
    );
}

function ControlsShowcase() {
    const [fontSize, setFontSize] = useState(14);

    return (
        <ShowcaseCard
            title="Controls"
            description="Switches, sliders, and segmented controls for settings and preferences."
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-dark-300 font-medium uppercase tracking-widest">
                        Theme
                    </span>
                    <SegmentedControl
                        fullWidth
                        defaultValue="dark"
                        data={[
                            { value: "light", label: "Light" },
                            { value: "dark", label: "Dark" },
                            { value: "system", label: "System" }
                        ]}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Switch
                        defaultChecked
                        label="Enable animations"
                        description="Smooth transitions across all components"
                    />
                    <Switch label="Compact mode" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-dark-300 font-medium uppercase tracking-widest">
                            Font size
                        </span>
                        <span className="text-xs text-dark-200 tabular-nums">
                            {fontSize}px
                        </span>
                    </div>
                    <Slider
                        min={10}
                        max={24}
                        value={fontSize}
                        onChange={setFontSize}
                        size="sm"
                    />
                </div>
            </div>
        </ShowcaseCard>
    );
}

function ProgressShowcase() {
    return (
        <ShowcaseCard
            title="Progress"
            description="Animated progress bars for tasks, uploads, and loading states."
        >
            <div className="flex flex-col gap-3 w-full">
                {[
                    { label: "Installation", value: 100 },
                    { label: "Testing", value: 72 },
                    { label: "Deployment", value: 45 },
                    { label: "Verification", value: 18 }
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-dark-200 w-24 shrink-0">
                            {label}
                        </span>
                        <Progress value={value} size="sm" className="flex-1" />
                        <span className="text-xs text-dark-300 w-8 text-right shrink-0">
                            {value}%
                        </span>
                    </div>
                ))}
            </div>
        </ShowcaseCard>
    );
}

function TabsShowcase() {
    return (
        <ShowcaseCard
            title="Tabs"
            description="Tabbed navigation for switching between related content views."
        >
            <Tabs defaultValue="preview">
                <Tabs.List>
                    <Tabs.Tab value="preview">Preview</Tabs.Tab>
                    <Tabs.Tab value="code">Code</Tabs.Tab>
                    <Tabs.Tab value="props">Props</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="preview">
                    <div className="pt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="filled">
                            Primary action
                        </Button>
                        <Button size="sm" variant="outline">
                            Secondary
                        </Button>
                        <Button size="sm" variant="ghost">
                            Cancel
                        </Button>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="code">
                    <pre className="mt-4 p-3 rounded-lg bg-dark-900 text-xs text-primary-300 overflow-x-auto leading-relaxed">
                        {`<Button variant="filled">
  Primary action
</Button>`}
                    </pre>
                </Tabs.Panel>

                <Tabs.Panel value="props">
                    <div className="mt-4 flex flex-col gap-2">
                        {[
                            {
                                prop: "variant",
                                type: `"default" | "filled" | "outline" | "ghost"`
                            },
                            {
                                prop: "size",
                                type: `"xs" | "sm" | "md" | "lg" | "xl"`
                            },
                            { prop: "loading", type: "boolean" },
                            { prop: "disabled", type: "boolean" }
                        ].map(({ prop, type }) => (
                            <div
                                key={prop}
                                className="flex items-baseline gap-2 text-xs"
                            >
                                <code className="text-primary-400 shrink-0">
                                    {prop}
                                </code>
                                <span className="text-dark-300 font-mono truncate">
                                    {type}
                                </span>
                            </div>
                        ))}
                    </div>
                </Tabs.Panel>
            </Tabs>
        </ShowcaseCard>
    );
}

interface ShowcaseCardProps {
    title: string;
    description: string;
    children: ReactNode;
}

function ShowcaseCard({ title, description, children }: ShowcaseCardProps) {
    return (
        <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6 flex flex-col gap-4 hover:border-dark-600 transition-colors duration-200">
            <div>
                <h3 className="text-base font-semibold text-white mb-1">
                    {title}
                </h3>
                <p className="text-sm text-dark-200">{description}</p>
            </div>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    );
}

interface FeatureCardData {
    icon: ReactNode;
    title: string;
    description: string;
}

function FeaturesSection() {
    const features: FeatureCardData[] = [
        {
            icon: <IconBraces size={22} />,
            title: "TypeScript First",
            description:
                "Every component ships with full type definitions. Autocomplete, IntelliSense, and type safety come standard."
        },
        {
            icon: <IconShieldCheck size={22} />,
            title: "Accessible by Default",
            description:
                "ARIA attributes, keyboard navigation, and focus management are built into every component out of the box."
        },
        {
            icon: <IconPalette size={22} />,
            title: "Tailwind Powered",
            description:
                "Styled with Tailwind CSS v4. Customize via the classNames API, override with className, or theme globally."
        },
        {
            icon: <IconBolt size={22} />,
            title: "Performant",
            description:
                "Lightweight and tree-shakeable. Import only what you need — zero bloat, zero unnecessary re-renders."
        }
    ];

    return (
        <section className="px-6 py-20 border-t border-dark-700">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Built for the modern web
                    </h2>
                    <p className="text-dark-200 max-w-xl mx-auto">
                        Designed with developer experience and end-user quality
                        equally in mind.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex gap-4 p-6 rounded-2xl border border-dark-700 bg-dark-800/30 hover:border-dark-600 transition-colors duration-200"
                        >
                            <div className="text-primary-400 shrink-0 mt-0.5">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-white mb-1.5">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-dark-200 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="px-6 py-24 border-t border-dark-700">
            <div
                className="max-w-3xl mx-auto rounded-3xl border border-dark-600 p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(59, 130, 246, 0.08), transparent 60%), var(--color-dark-800)"
                }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Start building today
                </h2>
                <p className="text-lg text-dark-200 max-w-md leading-relaxed">
                    Get up and running with Refraktor in minutes. Install the
                    package and start building.
                </p>
                <Button
                    variant="filled"
                    size="xl"
                    rightSection={<IconArrowRight size={18} />}
                    onClick={() => navigate({ to: "/get-started" })}
                >
                    Get Started
                </Button>
            </div>
        </section>
    );
}
