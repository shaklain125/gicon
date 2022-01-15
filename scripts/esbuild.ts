import * as esbuild from "esbuild";
import path from "path";

const relOutputFilePath = (entry: string, outputdir: string) => {
	if (!entry || !outputdir) return undefined;
	const rel = (from, to) => path.relative(from, to).replace(/\\/g, "/");
	entry = rel(".", entry);
	outputdir = rel(".", outputdir);
	const entry_split = entry.split("/");
	const base = entry_split.length > 1 ? entry_split[0] : ".";
	return path.join(outputdir, rel(base, entry)).replace(/.ts/, ".js");
};

const rel_output_conf = (entry: string, outputDir: string) => ({
	entryPoints: [entry],
	outfile: relOutputFilePath(entry, outputDir),
});

const isWatching = () => process.argv.includes("-w");

const watch_conf = () => {
	const watch = isWatching();
	return {
		minify: !watch,
		sourcemap: watch,
		watch,
	};
};

const objRemoveEmpty = (obj: Record<string, any>) =>
	Object.fromEntries(
		Object.entries(obj)
			.filter(([_, v]) => ![undefined, null].includes(v))
			.map(([k, v]) => [k, typeof v == "object" && !Array.isArray(v) ? objRemoveEmpty(v) : v])
	);

const ebuild = (
	entry: esbuild.BuildOptions["entryPoints"] | string,
	options: esbuild.BuildOptions
) => {
	entry = typeof entry == "string" ? [entry] : entry;

	const default_conf: esbuild.BuildOptions = {
		platform: "node",
		format: "cjs",

		bundle: true,

		legalComments: "none",
		logLevel: "info",
	};

	const build_conf: esbuild.BuildOptions = objRemoveEmpty({
		entryPoints: entry,
		...default_conf,
		...watch_conf(),
		...(options || {}),
	});

	return esbuild.build(build_conf);
};

export { ebuild, rel_output_conf, watch_conf, isWatching };
