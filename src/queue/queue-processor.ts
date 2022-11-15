
import Manager from "../manager/manager.js";
import DomParser from "../services/dom-parser.js";
import Http from "../services/http.js";
import HttpResponse from "../models/http-response.js";
import Task from "./task.js";
import CssParser from "../services/css-parser.js";
import {Validator} from "../validators/validator.js";
import Config from "../config.js";

export default class QueueProcessor
{
    private manager: Manager;

    public static validators: Array<Validator> = [];

    constructor(manager: Manager)
    {
        this.manager = manager;
    }

    async processJob(task: Task) : Promise<Task>
    {
        const response = await Http.request(task.hit_url.href, task.method);
        task.status = response.status;
        task.content_type = response.content_type;

        const links = [];

        if (QueueProcessor.isResponseOK(response)) {

            if (task.status === 200) {
                for (const validator of QueueProcessor.validators) {
                    validator.setBody(response.body).setContentType(response.content_type);
                    if (validator.canValidate()) {
                        if (!validator.isValid()) {
                            task.validator_errors = validator.errors;
                        }
                    }
                }
            }

            if (QueueProcessor.isResponseDOM(response)) {
                const dom_parser = new DomParser(response.body, task.hit_url, response.is_xml);
                links.push(...dom_parser.getLinks());
            } else if (QueueProcessor.isResponseCSS(response)) {
                const css_parser = new CssParser(response.body, task.hit_url);
                links.push(...css_parser.getLinks());
            }
        }

        for (const link of links) {
            // Don't wait for the promises here, add() already calls our task_finished handler when it's done
            // noinspection ES6MissingAwait
            this.manager.queue.add(
                new Task(
                    link,
                    link.hostname === Manager.base_url.hostname ? 'get' : 'head',
                    task.hit_url
                )
            );
        }

        return task;
    }

    static isResponseOK(response: HttpResponse)
    {
        return response.status === 200
            && response.body.length > 0
            && response.content_type;
    }

    static isResponseDOM(response: HttpResponse)
    {
        return Config.instance().dom_content_types.includes(response.content_type);
    }

    static isResponseCSS(response: HttpResponse)
    {
        return Config.instance().css_content_types.includes(response.content_type);
    }
}