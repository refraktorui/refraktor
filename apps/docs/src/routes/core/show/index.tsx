import Documentation from "@/components/Documentation";
import { Show } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/show/")({
    component: RouteComponent
});

const profile = {
    id: "u-4",
    name: "Taylor Brooks",
    role: "Maintainer"
};

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="Show"
                description="Render content conditionally with truthy checks, optional fallback UI, and optional render-function children."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/show/show.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <Documentation.Showcase
                            code={`import { Show } from "@refraktor/core";

export function Demo() {
  return (
    <Show when={true} fallback={<p>Hidden</p>}>
      <p>Visible content</p>
    </Show>
  );
}`}
                        >
                            <div className="w-full max-w-md rounded-lg border border-dark-600 bg-dark-800 px-4 py-3 text-sm text-white">
                                <Show when={true} fallback={<p>Hidden</p>}>
                                    <p>Visible content</p>
                                </Show>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="fallback"
                        title="Fallback"
                        description="Provide fallback content for falsy values like false, 0, empty strings, null, or undefined."
                    >
                        <Documentation.Showcase
                            code={`import { Show } from "@refraktor/core";

const pending = 0;

export function Demo() {
  return (
    <Show when={pending} fallback={<p>No pending tasks</p>}>
      <p>{pending} tasks pending</p>
    </Show>
  );
}`}
                        >
                            <div className="w-full max-w-md rounded-lg border border-dark-600 bg-dark-800 px-4 py-3 text-sm text-dark-200">
                                <Show
                                    when={0}
                                    fallback={<p>No pending tasks</p>}
                                >
                                    <p>0 tasks pending</p>
                                </Show>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="render-function"
                        title="Render function"
                        description="Use a render function when you want to consume the resolved when value directly in JSX."
                    >
                        <Documentation.Showcase
                            code={`import { Show } from "@refraktor/core";

const profile = {
  id: "u-4",
  name: "Taylor Brooks",
  role: "Maintainer"
};

export function Demo() {
  return (
    <Show when={profile} fallback={<p>Profile unavailable</p>}>
      {(user) => (
        <p>
          {user.name} - {user.role}
        </p>
      )}
    </Show>
  );
}`}
                        >
                            <div className="w-full max-w-md rounded-lg border border-dark-600 bg-dark-800 px-4 py-3 text-sm text-dark-200">
                                <Show
                                    when={profile}
                                    fallback={<p>Profile unavailable</p>}
                                >
                                    {(user) => (
                                        <p>
                                            {user.name} - {user.role}
                                        </p>
                                    )}
                                </Show>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="show-props"
                        title="Show Props"
                        description="The props for the Show component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="when"
                                type="T | null | undefined"
                                description="Value evaluated with Boolean(when). Truthy values render children and falsy values render fallback."
                            />
                            <Documentation.Props.Content
                                name="children"
                                type="ReactNode | ((value: T) => ReactNode)"
                                description="Content to render when when is truthy."
                                required
                            />
                            <Documentation.Props.Content
                                name="fallback"
                                type="ReactNode"
                                default="null"
                                description="Rendered when when is falsy."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
