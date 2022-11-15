var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Manager from "../manager/manager.js";
import DomParser from "../services/dom-parser.js";
import Http from "../services/http.js";
import Task from "./task.js";
import CssParser from "../services/css-parser.js";
import Config from "../config.js";
export default class QueueProcessor {
    constructor(manager) {
        this.manager = manager;
    }
    processJob(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Http.request(task.hit_url.href, task.method);
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
                }
                else if (QueueProcessor.isResponseCSS(response)) {
                    const css_parser = new CssParser(response.body, task.hit_url);
                    links.push(...css_parser.getLinks());
                }
            }
            for (const link of links) {
                // Don't wait for the promises here, add() already calls our task_finished handler when it's done
                // noinspection ES6MissingAwait
                this.manager.queue.add(new Task(link, link.hostname === Manager.base_url.hostname ? 'get' : 'head', task.hit_url));
            }
            return task;
        });
    }
    static isResponseOK(response) {
        return response.status === 200
            && response.body.length > 0
            && response.content_type;
    }
    static isResponseDOM(response) {
        return Config.instance().dom_content_types.includes(response.content_type);
    }
    static isResponseCSS(response) {
        return Config.instance().css_content_types.includes(response.content_type);
    }
}
QueueProcessor.validators = [];
//# sourceMappingURL=queue-processor.js.map