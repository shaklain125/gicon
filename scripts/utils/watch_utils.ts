import nodemon from "nodemon";
import path from "path";

const watch_script_nodemon = (script: string, options: nodemon.Settings = {}) =>
	nodemon({
		script: path.resolve(script),
		watch: [path.resolve(script)],
		ext: "*",
		...options,
	});

export { watch_script_nodemon };
