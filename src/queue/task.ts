import Url from "../models/url.js";
import {Method} from "got";
import {ValidatorError} from "../validators/validator";

export default class Task
{
    public id: string;
    public parent_url: Url | undefined;
    public hit_url: Url;
    public method: Method;

    // below populated after processing:
    public status: number = 0;
    public content_type: string = '';
    public validator_errors: Array<ValidatorError> = [];

    constructor(hit_url: Url, method: Method, parent_url: Url | undefined) {
        this.id = hit_url.href;
        this.hit_url = hit_url;
        this.method = method;
        this.parent_url = parent_url;
    }

}