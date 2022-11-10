
import got, {Method} from "got";
import HttpResponse from "../models/http-response.js";

export default class Http
{
    /**
     * @param url
     * @param method
     */
    static async request(url: string, method: Method='head') : Promise<HttpResponse>
    {
        const response = await got(url, {
            method: method,
            throwHttpErrors: false
        });
        return new HttpResponse(url, response.body, response.statusCode, response.headers["content-type"]);
    }
}