import { Handler } from "aws-lambda";
import express, { Response } from "express";
import serverless from "serverless-http";
import { getContentType, httpRequest, isImageContentType } from "./lib/utils";

const app = express();
const router = express.Router();

const args = {
	is_dev: /development/gi.test(process.env.NODE_ENV || ""),
	is_netlify: !!process.env.NETLIFY,
	listen: process.argv.includes("-listen"),
	get port() {
		let indx = process.argv.indexOf("-p");
		let _port = indx != -1 ? process.argv[indx + 1] : undefined;
		let _port_n = +(_port ?? "") || undefined;
		_port = typeof _port_n == "number" ? _port_n + "" : undefined;
		return _port;
	},
};

const withCorsAnywhere = (res: Response) => {
	const cors_headers = {
		"Access-Control-Allow-Headers":
			"Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin",
		"Access-Control-Allow-Origin": "*",
		Vary: "Origin",
		"cache-control": "max-age=0,no-cache,no-store,must-revalidate",
	};
	Object.entries(cors_headers).forEach(h => res.setHeader(...h));
};

router.get("/", (req, res) => {
	let { url, sz } = req.query;
	const def_res = () => res.send({ status: "ok" }); //`<body bgcolor="black"></body>`
	if (typeof url == "string") {
		const sizes = [16, 32, 64, 128, 256];
		const favicon_req = `https://www.google.com/s2/favicons?sz=${
			sz ?? sizes.pop()
		}&domain_url=${url}`;
		httpRequest(favicon_req, { responseType: "arraybuffer" }).then(({ data, headers }) => {
			data = data || "";
			if (!data) return def_res();
			Object.entries<string>(headers).forEach(([key, value]) => {
				if (key.match(/encoding/gi)) return;
				res.setHeader(key, value);
			});
			withCorsAnywhere(res);

			if (args.is_netlify) {
				if (args.is_dev) {
					res.send(data);
					return;
				}
				res.setHeader("Content-Length", data.length);
				res.end(data.toString("base64"));
			} else {
				// res.setHeader("Content-Length", data.length);
				res.send(data);
			}
		});
		return;
	}
	def_res();
});

router.get("/api", (req, res) => {
	withCorsAnywhere(res);
	res.send({ Api: "ok" });
});

app.use(args.is_netlify ? "/.netlify/functions/api" : "/", router);

if (args.listen) {
	const port = process.env.PORT || (args.port ?? "3000");
	app.listen(port, () =>
		console.log(`Listening on port ${port} http://localhost${port == "80" ? "" : `:${port}`}`)
	);
}

let handler: Handler | undefined;

if (args.is_netlify) {
	const _handler = serverless(app);

	handler = async (event, context) => {
		const result = await _handler(event, context);
		const is_img_ctype = isImageContentType(getContentType(result.headers));
		result.isBase64Encoded = is_img_ctype;
		return result;
	};
}

export { handler };

export default app;
