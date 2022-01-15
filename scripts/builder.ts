import fs from "fs-extra";
import { ebuild, isWatching } from "./esbuild";
import { watch_script_nodemon } from "./utils/watch_utils";

(async () => {
	const isWatch = isWatching();

	fs.removeSync("functions");

	const outfile = "functions/api.js";

	await ebuild("./src/main.ts", {
		outfile,
		minify: true,
	});

	if (!isWatch) return;

	const startWatchServer = () =>
		watch_script_nodemon(outfile, {
			args: ["-listen", "-p", "9000"],
		});

	startWatchServer();
})();
