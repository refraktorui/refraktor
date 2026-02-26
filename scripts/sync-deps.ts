import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

interface PackageJson {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    [key: string]: unknown;
}

const DEP_FIELDS = ["dependencies", "devDependencies"] as const;

async function getAllPackageJsonPaths(): Promise<string[]> {
    const root = process.cwd();
    const paths = [join(root, "package.json")];

    for (const dir of ["packages", "apps"]) {
        const fullDir = join(root, dir);
        try {
            const entries = await readdir(fullDir, { withFileTypes: true });
            for (const entry of entries.filter((d) => d.isDirectory())) {
                paths.push(join(fullDir, entry.name, "package.json"));
            }
        } catch {
            // directory doesn't exist, skip
        }
    }

    return paths;
}

function parseRange(spec: string): { prefix: string; version: string } | null {
    if (spec.startsWith("workspace:") || spec.startsWith("npm:")) return null;
    if (spec.startsWith(">=")) return { prefix: ">=", version: spec.slice(2) };

    const match = spec.match(/^([\^~]?)(\d+\.\d+\.\d+.*)$/);
    if (!match) return null;
    return { prefix: match[1] || "", version: match[2] };
}

function compareVersions(a: string, b: string): number {
    const pa = a.replace(/-.*$/, "").split(".").map(Number);
    const pb = b.replace(/-.*$/, "").split(".").map(Number);

    for (let i = 0; i < 3; i++) {
        if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
    }

    const preA = a.includes("-") ? a.split("-")[1] : null;
    const preB = b.includes("-") ? b.split("-")[1] : null;
    if (!preA && preB) return 1;
    if (preA && !preB) return -1;
    return 0;
}

async function main() {
    const dryRun = process.argv.includes("--dry-run");

    if (dryRun) console.log("  (dry run — no files will be written)\n");

    const paths = await getAllPackageJsonPaths();
    const packages: { path: string; pkg: PackageJson; raw: string }[] = [];

    for (const p of paths) {
        try {
            const raw = await readFile(p, "utf-8");
            packages.push({ path: p, pkg: JSON.parse(raw), raw });
        } catch {
            // skip missing files
        }
    }

    // Collect the highest version for each dependency across all files
    const highest = new Map<string, { prefix: string; version: string }>();

    for (const { pkg } of packages) {
        for (const field of DEP_FIELDS) {
            const deps = pkg[field];
            if (!deps) continue;

            for (const [name, spec] of Object.entries(deps)) {
                const parsed = parseRange(spec);
                if (!parsed) continue;

                const existing = highest.get(name);
                if (
                    !existing ||
                    compareVersions(parsed.version, existing.version) > 0
                ) {
                    highest.set(name, parsed);
                }
            }
        }
    }

    let totalUpdates = 0;

    for (const { path: pkgPath, pkg } of packages) {
        const updates: string[] = [];
        const shortPath = pkgPath.replace(process.cwd() + "\\", "").replace(process.cwd() + "/", "");

        for (const field of DEP_FIELDS) {
            const deps = pkg[field];
            if (!deps) continue;

            for (const [name, spec] of Object.entries(deps)) {
                const parsed = parseRange(spec);
                if (!parsed) continue;

                const best = highest.get(name);
                if (!best) continue;

                if (compareVersions(parsed.version, best.version) < 0) {
                    const oldSpec = spec;
                    const newSpec = `${parsed.prefix}${best.version}`;
                    deps[name] = newSpec;
                    updates.push(`  ${name}: ${oldSpec} → ${newSpec}`);
                }
            }
        }

        if (updates.length > 0) {
            console.log(`${shortPath} (${updates.length} update${updates.length > 1 ? "s" : ""}):`);
            for (const u of updates) console.log(u);
            console.log("");
            totalUpdates += updates.length;

            if (!dryRun) {
                await writeFile(
                    pkgPath,
                    JSON.stringify(pkg, null, 4) + "\n"
                );
            }
        }
    }

    if (totalUpdates === 0) {
        console.log("All dependencies are already in sync.");
    } else {
        console.log(
            `${dryRun ? "Would update" : "Updated"} ${totalUpdates} version range${totalUpdates > 1 ? "s" : ""} across workspace.`
        );
        if (!dryRun) {
            console.log("\nRun `bun install` to update the lockfile.");
        }
    }
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
