import { Method } from "got";
import HttpResponse from "../models/http-response";
export default class Http {
    /**
     * @param url
     * @param method
     */
    static request(url: string, method?: Method): Promise<HttpResponse>;
}
