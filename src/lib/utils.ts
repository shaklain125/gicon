import { http } from "./http_axios";

const parseJSON = (data: any) => {
	try {
		return JSON.parse(data);
	} catch (error) {
		return undefined;
	}
};

type HttpOpts = Exclude<Parameters<typeof http.raw>[0], string>;

const httpRequest = async (url: string, rest: HttpOpts) => {
	const parseParam = (func: Function, param: any) =>
		param != undefined ? func(decodeURIComponent(param)) || undefined : undefined;

	const options: HttpOpts = {
		...rest,
		maxBodyLength: parseParam(parseInt, rest.maxBodyLength),
		maxContentLength: parseParam(parseInt, rest.maxContentLength),
		maxRedirects: parseParam(parseInt, rest.maxRedirects),
		timeout: parseParam(parseInt, rest.timeout),

		withCredentials: parseParam(Boolean, rest.withCredentials),
		decompress: parseParam(Boolean, rest.decompress),

		auth: parseParam(parseJSON, rest.auth),
		params: parseParam(parseJSON, rest.params),
		proxy: parseParam(parseJSON, rest.proxy),

		url: decodeURIComponent(url),
		method: rest.method || undefined,
		data: parseParam(parseJSON, rest.data) || rest.data,
		headers: parseParam(parseJSON, rest.headers),
	};
	const data = await http.raw(options);
	return { data: data?.data || "", req_options: options, headers: data?.headers || {} };
};

const getContentType = (headers?: Record<string, any>): string | undefined =>
	headers?.["content-type"] || headers?.["Content-Type"];

const isImageContentType = (content_type?: string) => !!(content_type ?? "").match(/(image)\//gi);

const is_unknown_file = (buff: any) => {
	const unknown_buff = Buffer.from([239, 191, 189]).toString();
	const unknowns = buff.toString().match(new RegExp(unknown_buff, "g"));
	return (unknowns?.length || 0) > 10;
};

export { httpRequest, parseJSON, getContentType, isImageContentType, is_unknown_file };
