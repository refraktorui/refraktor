import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

interface PackageJson {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
}

type BumpType = "major" | "minor" | "patch" | "alpha" | "beta" | "rc";

async function getPackages(): Promise<string[]> {
    const dir = join(process.cwd(), "packages");
    const packages = await readdir(dir, { withFileTypes: true });

    return packages
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => join(dir, dirent.name, "package.json"));
}

function parseVersion(version: string): { base: string; prerelease?: string } {
    const match = version.match(/^(\d+\.\d+\.\d+)(?:-(.+))?$/);
    if (!match) throw new Error(`Invalid version: ${version}`);
    return { base: match[1], prerelease: match[2] };
}

function bumpVersion(
    currentVersion: string,
    type: BumpType,
    customVersion?: string
): string {
    if (customVersion) return customVersion;

    const { base, prerelease } = parseVersion(currentVersion);
    const [major, minor, patch] = base.split(".").map(Number);

    switch (type) {
        case "major":
            return `${major + 1}.0.0`;
        case "minor":
            return `${major}.${minor + 1}.0`;
        case "patch":
            return `${major}.${minor}.${patch + 1}`;
        case "alpha": {
            if (prerelease?.startsWith("alpha.")) {
                const num = parseInt(prerelease.split(".")[1]) || 0;
                return `${base}-alpha.${num + 1}`;
            }
            return `${major}.${minor}.${patch + 1}-alpha.0`;
        }
        case "beta": {
            if (prerelease?.startsWith("beta.")) {
                const num = parseInt(prerelease.split(".")[1]) || 0;
                return `${base}-beta.${num + 1}`;
            }
            return `${major}.${minor}.${patch + 1}-beta.0`;
        }
        case "rc": {
            if (prerelease?.startsWith("rc.")) {
                const num = parseInt(prerelease.split(".")[1]) || 0;
                return `${base}-rc.${num + 1}`;
            }
            return `${major}.${minor}.${patch + 1}-rc.0`;
        }
        default:
            throw new Error(`Unknown bump type: ${type}`);
    }
}

async function updatePackage(
    packagePath: string,
    newVersions: Map<string, string>,
    allPackageNames: Set<string>
): Promise<void> {
    const content = await readFile(packagePath, "utf-8");
    const pkg: PackageJson = JSON.parse(content);

    const newVersion = newVersions.get(pkg.name);
    if (newVersion) {
        pkg.version = newVersion;
    }

    for (const depType of [
        "dependencies",
        "devDependencies",
        "peerDependencies"
    ] as const) {
        const deps = pkg[depType];
        if (!deps) continue;

        for (const [depName, depVersion] of Object.entries(deps)) {
            if (allPackageNames.has(depName)) {
                const newDepVersion = newVersions.get(depName);
                if (newDepVersion) {
                    if (depVersion.startsWith("workspace:")) {
                        deps[depName] = `workspace:*`;
                    } else if (depVersion.match(/^\d+\.\d+\.\d+/)) {
                        deps[depName] = newDepVersion;
                        console.log(
                            `  📌 ${pkg.name}: ${depName} ${depVersion} → ${newDepVersion}`
                        );
                    } else if (depVersion.match(/^[\^~><=]/)) {
                        const prefix =
                            depVersion.match(/^[\^~><=]+/)?.[0] || "^";
                        deps[depName] = `${prefix}${newDepVersion}`;
                        console.log(
                            `  📌 ${pkg.name}: ${depName} ${depVersion} → ${prefix}${newDepVersion}`
                        );
                    }
                }
            }
        }
    }

    await writeFile(packagePath, JSON.stringify(pkg, null, 2) + "\n");
}

async function main() {
    const args = process.argv.slice(2);
    const bumpType = (args[0] || "patch") as BumpType;
    const customVersion = args[1];

    console.log(`🚀 Bumping versions: ${customVersion || bumpType}\n`);

    const packagePaths = await getPackages();
    const newVersions = new Map<string, string>();
    const allPackageNames = new Set<string>();

    for (const packagePath of packagePaths) {
        const content = await readFile(packagePath, "utf-8");
        const pkg: PackageJson = JSON.parse(content);
        allPackageNames.add(pkg.name);
        const newVersion = bumpVersion(pkg.version, bumpType, customVersion);
        newVersions.set(pkg.name, newVersion);
        console.log(`  ${pkg.name}: ${pkg.version} → ${newVersion}`);
    }

    console.log("\n📦 Updating dependencies...\n");

    for (const packagePath of packagePaths) {
        await updatePackage(packagePath, newVersions, allPackageNames);
    }

    console.log("\n✅ Version bump complete!\n");
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
