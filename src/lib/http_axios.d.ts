/// <reference types="node" />
/// <reference types="cheerio" />
import { AxiosRequestConfig, AxiosResponse, Method } from "axios";
declare module "axios" {
    interface AxiosRequestConfig {
        responseEncoding?: BufferEncoding;
    }
}
declare type ReqOptions = string | AxiosRequestConfig<any>;
declare class HTTP_METHODS {
    constructor();
    get get(): {
        raw: (options: ReqOptions) => Promise<AxiosResponse<any, any> | null>;
        html: (options: ReqOptions) => Promise<{
            res: cheerio.Root;
            html: string;
        } | null>;
        json: (options: ReqOptions) => Promise<{
            res: any;
        } | null>;
    };
    get post(): {
        raw: (options: ReqOptions) => Promise<AxiosResponse<any, any> | null>;
        html: (options: ReqOptions) => Promise<{
            res: cheerio.Root;
            html: string;
        } | null>;
        json: (options: ReqOptions) => Promise<{
            res: any;
        } | null>;
    };
    get head(): {
        raw: (options: ReqOptions) => Promise<AxiosResponse<any, any> | null>;
        html: (options: ReqOptions) => Promise<{
            res: cheerio.Root;
            html: string;
        } | null>;
        json: (options: ReqOptions) => Promise<{
            res: any;
        } | null>;
    };
    method(method?: Method): {
        raw: (options: ReqOptions) => Promise<AxiosResponse<any, any> | null>;
        html: (options: ReqOptions) => Promise<{
            res: cheerio.Root;
            html: string;
        } | null>;
        json: (options: ReqOptions) => Promise<{
            res: any;
        } | null>;
    };
    private getReqFunctions;
    private setReqMethod;
    private parse_params;
    parseHtml(html: string): cheerio.Root;
    private html;
    private json;
    raw(options: ReqOptions): Promise<AxiosResponse<any, any> | null>;
}
declare const http: HTTP_METHODS;
export declare type HttpAxios = typeof http;
export { http };
