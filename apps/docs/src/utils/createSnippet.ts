function formatProp(key: string, value: unknown, def: unknown): string | null {
    if (def !== undefined && value === def) return null;

    if (typeof value === "boolean") {
        return value ? key : `${key}={false}`;
    }

    if (typeof value === "string") {
        return `${key}="${value}"`;
    }

    if (value === null) return `${key}={null}`;
    if (value === undefined) return null;

    return `${key}={${JSON.stringify(value)}}`;
}

export interface CreateSnippetOptions {
    imports?: string[];
    jsx?: string;
    component?: string;
    values?: Record<string, unknown>;
    defaults?: Record<string, unknown>;
    children?: string;
}

export function createSnippet(options: CreateSnippetOptions): string {
    const {
        imports = [],
        jsx,
        component,
        values = {},
        defaults = {},
        children
    } = options;

    let inner = "";

    if (jsx) {
        inner = jsx.trim();
    } else if (component) {
        const props = Object.entries(values)
            .map(([key, value]) => formatProp(key, value, defaults[key]))
            .filter((p): p is string => p !== null);

        const propsBlock = props.map((p) => `  ${p}`).join("\n");

        if (children) {
            inner =
                props.length > 0
                    ? `<${component}\n${propsBlock}\n>\n  ${children.trim()}\n</${component}>`
                    : `<${component}>\n  ${children.trim()}\n</${component}>`;
        } else {
            inner =
                props.length > 0
                    ? `<${component}\n${propsBlock}\n/>`
                    : `<${component} />`;
        }
    }

    const importBlock = imports.join("\n");
    const indentedInner = inner
        .split("\n")
        .map((line) => `      ${line}`)
        .join("\n");

    return [
        importBlock,
        "",
        "export function Demo() {",
        "  return (",
        "    <>",
        indentedInner,
        "    </>",
        "  );",
        "}"
    ].join("\n");
}
