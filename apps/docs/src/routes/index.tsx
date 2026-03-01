import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    Accordion,
    Button,
    Checkbox,
    Progress,
    ProgressCircle,
    SegmentedControl,
    Slider,
    Switch,
    Transition
} from "@refraktor/core";
import { type ReactNode, useState } from "react";
import {
    IconArrowRight,
    IconBolt,
    IconBraces,
    IconBrandGithub,
    IconCheck,
    IconCopy,
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
            <BentoShowcase />
            <FeaturesSection />
            <CTASection />
        </div>
    );
}

function HeroSection() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const copyInstall = () => {
        navigator.clipboard.writeText("bun i @refraktor/core");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6 py-28 overflow-hidden">
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
                <Transition
                    mounted
                    transition="slide-up"
                    duration={600}
                    delay={100}
                >
                    <div className="flex flex-col items-center">
                        <h1
                            className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tight text-white"
                            style={{ lineHeight: 1 }}
                        >
                            Build interfaces
                        </h1>
                        <h1
                            className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tight mt-1"
                            style={{
                                lineHeight: 1.1,
                                background:
                                    "linear-gradient(135deg, var(--color-primary-200), var(--color-primary-400), var(--color-primary-600))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}
                        >
                            that feel alive.
                        </h1>
                    </div>
                </Transition>

                <Transition
                    mounted
                    transition="slide-up"
                    duration={500}
                    delay={250}
                >
                    <p className="text-base md:text-lg text-dark-200 max-w-lg leading-relaxed">
                        Accessible, TypeScript-first React components powered by
                        Tailwind CSS v4. Beautiful defaults, endlessly
                        customizable.
                    </p>
                </Transition>

                <Transition
                    mounted
                    transition="slide-up"
                    duration={500}
                    delay={400}
                >
                    <div className="flex flex-col items-center gap-5 mt-2">
                        <button
                            onClick={copyInstall}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dark-600 bg-dark-900/80 backdrop-blur-sm cursor-pointer group hover:border-dark-500 transition-colors"
                        >
                            <span className="text-dark-400 text-sm font-mono">
                                $
                            </span>
                            <code className="text-sm text-dark-100 font-mono">
                                bun i @refraktor/core
                            </code>
                            <span className="text-dark-400 group-hover:text-dark-200 transition-colors ml-1">
                                {copied ? (
                                    <IconCheck size={14} />
                                ) : (
                                    <IconCopy size={14} />
                                )}
                            </span>
                        </button>

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
                    </div>
                </Transition>
            </div>
        </section>
    );
}

function BentoShowcase() {
    return (
        <section className="px-6 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        See it in action
                    </h2>
                    <p className="text-dark-200 max-w-lg mx-auto text-base">
                        Interactive components you can play with right here.
                        Crafted for developers and end users alike.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <BentoControlsCard />
                    <BentoProgressCard />
                    <BentoAccordionCard />
                </div>
            </div>
        </section>
    );
}

function BentoControlsCard() {
    const [fontSize, setFontSize] = useState(14);

    return (
        <div className="md:col-span-2 rounded-2xl border border-dark-700 bg-dark-800/60 p-6 bento-glow">
            <div className="mb-5">
                <span className="text-[10px] text-primary-400 font-semibold uppercase tracking-[0.15em]">
                    Controls
                </span>
                <h3 className="text-lg font-semibold text-white mt-1">
                    Switches, sliders & segmented controls
                </h3>
            </div>

            <div className="flex flex-col gap-5">
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

                <div className="flex flex-col gap-3">
                    <Switch
                        defaultChecked
                        label="Enable animations"
                        description="Smooth transitions across all components"
                    />
                    <Switch label="Compact mode" />
                    <Checkbox defaultChecked label="Show code snippets" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-dark-300 font-medium uppercase tracking-widest">
                            Font size
                        </span>
                        <span className="text-xs text-dark-200 tabular-nums font-mono">
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
        </div>
    );
}

function BentoProgressCard() {
    return (
        <div className="rounded-2xl border border-dark-700 bg-dark-800/60 p-6 bento-glow flex flex-col">
            <span className="text-[10px] text-primary-400 font-semibold uppercase tracking-[0.15em]">
                Progress
            </span>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
                <ProgressCircle value={72} size={48} />
                <div className="text-center">
                    <span className="text-2xl font-bold text-white tabular-nums">
                        72%
                    </span>
                    <p className="text-xs text-dark-300 mt-0.5">
                        Build progress
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-auto pt-3 border-t border-dark-700/60">
                {[
                    { label: "Tests", value: 96 },
                    { label: "Types", value: 100 },
                    { label: "Lint", value: 84 }
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="text-[11px] text-dark-300 w-10 shrink-0">
                            {label}
                        </span>
                        <Progress value={value} size="xs" className="flex-1" />
                        <span className="text-[11px] text-dark-400 w-8 text-right tabular-nums font-mono">
                            {value}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BentoAccordionCard() {
    return (
        <div className="md:col-span-3 rounded-2xl border border-dark-700 bg-dark-800/60 p-6 bento-glow">
            <span className="text-[10px] text-primary-400 font-semibold uppercase tracking-[0.15em]">
                Disclosure
            </span>
            <h3 className="text-lg font-semibold text-white mt-1 mb-4">
                Accordion
            </h3>

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
        </div>
    );
}

interface FeatureData {
    icon: ReactNode;
    title: string;
    description: string;
}

function FeaturesSection() {
    const features: FeatureData[] = [
        {
            icon: <IconBraces size={20} />,
            title: "TypeScript First",
            description:
                "Full type definitions for every component. Autocomplete, IntelliSense, and compile-time safety."
        },
        {
            icon: <IconShieldCheck size={20} />,
            title: "Accessible by Default",
            description:
                "ARIA attributes, keyboard navigation, and focus management built into every component."
        },
        {
            icon: <IconPalette size={20} />,
            title: "Tailwind CSS v4",
            description:
                "Styled with utility classes. Customize via the classNames API, override with className, or theme globally."
        },
        {
            icon: <IconBolt size={20} />,
            title: "Performant & Lightweight",
            description:
                "Tree-shakeable. Import only what you need — zero bloat, zero unnecessary re-renders."
        }
    ];

    return (
        <section className="px-6 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Built for the modern stack
                    </h2>
                    <p className="text-dark-200 max-w-lg mx-auto text-base">
                        Designed with developer experience and end-user quality
                        equally in mind.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group relative flex gap-4 p-6 rounded-2xl border border-dark-700 bg-dark-800/40 feature-glow"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0 group-hover:bg-primary-500/15 transition-colors duration-300">
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
        <section className="px-6 py-24">
            <div className="max-w-4xl mx-auto relative">
                <div
                    className="relative rounded-3xl border border-dark-600 p-12 md:p-16 text-center flex flex-col items-center gap-6 overflow-hidden"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(59, 130, 246, 0.06), transparent 60%), var(--color-dark-800)"
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "20px 20px"
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Ready to build something great?
                        </h2>
                        <p className="text-lg text-dark-200 max-w-md leading-relaxed">
                            Get up and running in minutes. One install,
                            beautiful components, shipped.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                            <Button
                                variant="filled"
                                size="xl"
                                rightSection={<IconArrowRight size={18} />}
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
                                size="xl"
                                leftSection={<IconBrandGithub size={18} />}
                            >
                                Star on GitHub
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
