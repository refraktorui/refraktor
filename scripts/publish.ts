import { readdir, readFile } from "fs/promises";
import { join } from "path";

interface PackageJson {
    name: string;
    version: string;
    private?: boolean;
}

async function getPackages(): Promise<{ dir: string; pkg: PackageJson }[]> {
    const packagesDir = join(process.cwd(), "packages");
    const entries = await readdir(packagesDir, { withFileTypes: true });
    const result: { dir: string; pkg: PackageJson }[] = [];

    for (const entry of entries.filter((d) => d.isDirectory())) {
        const pkgPath = join(packagesDir, entry.name, "package.json");
        const content = await readFile(pkgPath, "utf-8");
        const pkg: PackageJson = JSON.parse(content);

        if (!pkg.private) {
            result.push({ dir: join(packagesDir, entry.name), pkg });
        }
    }

    return result;
}

function run(cmd: string[], cwd?: string): void {
    const result = Bun.spawnSync(cmd, {
        cwd,
        stdout: "inherit",
        stderr: "inherit",
        stdin: "inherit"
    });

    if (result.exitCode !== 0) {
        throw new Error(
            `Command failed: ${cmd.join(" ")} (exit code ${result.exitCode})`
        );
    }
}

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes("--dry-run");
    const skipBuild = args.includes("--skip-build");
    const tagIndex = args.indexOf("--tag");
    const tag = tagIndex !== -1 ? args[tagIndex + 1] : undefined;

    console.log(`\n📦 Refraktor Publish`);
    if (dryRun) console.log(`   ⚠️  Dry run — no packages will be published`);
    if (tag) console.log(`   🏷️  Tag: ${tag}`);
    if (skipBuild) console.log(`   ⏭️  Skipping build`);
    console.log("");

    // Step 1: Build all packages
    if (!skipBuild) {
        console.log("🔨 Building all packages...\n");
        run(["bun", "run", "build"]);
        console.log("\n✅ Build complete!\n");
    }

    // Step 2: Collect packages to publish
    const packages = await getPackages();

    if (packages.length === 0) {
        console.log("⚠️  No publishable packages found.\n");
        return;
    }

    console.log(`📋 ${packages.length} package(s) to publish:\n`);
    for (const { pkg } of packages) {
        console.log(`   • ${pkg.name}@${pkg.version}`);
    }
    console.log("");

    // Step 3: Publish each package
    const publishArgs = ["publish"];
    if (dryRun) publishArgs.push("--dry-run");
    if (tag) publishArgs.push("--tag", tag);

    let published = 0;

    for (const { dir, pkg } of packages) {
        console.log(`🚀 Publishing ${pkg.name}@${pkg.version}...`);
        run(["bun", ...publishArgs], dir);
        if (!dryRun) console.log(`✅ ${pkg.name}@${pkg.version} published\n`);
        published++;
    }

    if (dryRun) {
        console.log(
            `🎉 Dry run complete — ${published} package(s) ready to publish.\n`
        );
    } else {
        console.log(
            `🎉 Done! ${published} package(s) published successfully.\n`
        );
    }
}

main().catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
});
