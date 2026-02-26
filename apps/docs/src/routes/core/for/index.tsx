import Documentation from "@/components/Documentation";
import { For } from "@refraktor/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/core/for/")({
    component: RouteComponent
});

const team = [
    { id: "u-1", name: "Alex Morgan", role: "Product" },
    { id: "u-2", name: "Jordan Lee", role: "Engineering" },
    { id: "u-3", name: "Riley Kim", role: "Design" }
];

const steps = ["Install", "Configure", "Ship"];

function RouteComponent() {
    return (
        <Documentation>
            <Documentation.Title
                name="For"
                description="Render collections with declarative JSX, optional fallback content, and metadata for index and edge states."
                packageName="core"
                source="https://github.com/refraktorui/refraktor/blob/main/packages/core/src/components/for/for.tsx"
            />

            <Documentation.Tabs defaultTab="docs">
                <Documentation.Tab id="docs">
                    <Documentation.Section id="usage" title="Usage">
                        <Documentation.Showcase
                            code={`import { For } from "@refraktor/core";

const team = [
  { id: "u-1", name: "Alex Morgan", role: "Product" },
  { id: "u-2", name: "Jordan Lee", role: "Engineering" },
  { id: "u-3", name: "Riley Kim", role: "Design" }
];

export function Demo() {
  return (
    <ul>
      <For each={team} keyExtractor={(member) => member.id}>
        {(member) => (
          <li>
            {member.name} - {member.role}
          </li>
        )}
      </For>
    </ul>
  );
}`}
                        >
                            <ul className="w-full max-w-md divide-y divide-dark-600 rounded-lg border border-dark-600 bg-dark-800">
                                <For each={team} keyExtractor={(member) => member.id}>
                                    {(member) => (
                                        <li className="flex items-center justify-between px-4 py-2.5">
                                            <span className="text-sm text-white">
                                                {member.name}
                                            </span>
                                            <span className="text-xs text-dark-200">
                                                {member.role}
                                            </span>
                                        </li>
                                    )}
                                </For>
                            </ul>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="fallback"
                        title="Fallback"
                        description="Use fallback to render empty states when there are no items."
                    >
                        <Documentation.Showcase
                            code={`import { For } from "@refraktor/core";

const notifications: string[] = [];

export function Demo() {
  return (
    <For each={notifications} fallback={<p>No notifications yet.</p>}>
      {(item) => <p>{item}</p>}
    </For>
  );
}`}
                        >
                            <div className="w-full max-w-md rounded-lg border border-dark-600 bg-dark-800 px-4 py-3 text-sm text-dark-200">
                                <For
                                    each={[]}
                                    fallback={<p>No notifications yet.</p>}
                                >
                                    {(item: string) => <p>{item}</p>}
                                </For>
                            </div>
                        </Documentation.Showcase>
                    </Documentation.Section>

                    <Documentation.Section
                        id="metadata"
                        title="Render metadata"
                        description="Use meta values like index, length, isFirst, and isLast to style or label items based on position."
                    >
                        <Documentation.Showcase
                            code={`import { For } from "@refraktor/core";

const steps = ["Install", "Configure", "Ship"];

export function Demo() {
  return (
    <ol>
      <For each={steps}>
        {(step, meta) => (
          <li>
            {step} ({meta.index + 1}/{meta.length})
            {meta.isFirst ? " first" : ""}
            {meta.isLast ? " last" : ""}
          </li>
        )}
      </For>
    </ol>
  );
}`}
                        >
                            <ol className="w-full max-w-md space-y-2">
                                <For each={steps}>
                                    {(step, meta) => (
                                        <li className="flex items-center justify-between rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-sm">
                                            <span className="text-white">{step}</span>
                                            <span className="text-xs text-dark-200">
                                                {meta.index + 1}/{meta.length}
                                                {meta.isFirst ? " - first" : ""}
                                                {meta.isLast ? " - last" : ""}
                                            </span>
                                        </li>
                                    )}
                                </For>
                            </ol>
                        </Documentation.Showcase>
                    </Documentation.Section>
                </Documentation.Tab>

                <Documentation.Tab id="props">
                    <Documentation.Section
                        id="for-props"
                        title="For Props"
                        description="The props for the For component."
                    >
                        <Documentation.Props>
                            <Documentation.Props.Content
                                name="each"
                                type="readonly T[] | Iterable<T> | ArrayLike<T> | null"
                                description="Collection to iterate over."
                            />
                            <Documentation.Props.Content
                                name="children"
                                type="(item: T, meta: ForRenderMeta<T>) => ReactNode"
                                description="Render function called for every item."
                                required
                            />
                            <Documentation.Props.Content
                                name="fallback"
                                type="ReactNode"
                                default="null"
                                description="Rendered when the collection is empty."
                            />
                            <Documentation.Props.Content
                                name="keyExtractor"
                                type="(item: T, index: number) => Key"
                                description="Returns a stable key for each rendered item."
                            />
                        </Documentation.Props>
                    </Documentation.Section>
                </Documentation.Tab>
            </Documentation.Tabs>
        </Documentation>
    );
}
