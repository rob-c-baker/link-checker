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
import Parser from "../services/parser.js";
import Http from "../services/http.js";
export default class QueueProcessor {
    constructor(queue, manager) {
        this.queue = queue;
        this.manager = manager;
    }
    processJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Http.request(job.hit_url.href, job.method);
            if (QueueProcessor.canParseResponse(response)) {
                const parser = new Parser(response.body);
                const links = parser.filterLinks(parser.findLinks(response.is_xml));
                for (const link of links) {
                    this.manager.queue.addJob({
                        parent_url: job.hit_url,
                        hit_url: link,
                        method: link.hostname === Manager.base_url.hostname ? 'get' : 'head' // head method for external URLs
                    });
                }
            }
            return {
                source_url: job.parent_url,
                hit_url: job.hit_url,
                status: response.status
            };
        });
    }
    static canParseResponse(response) {
        return response.status === 200
            && response.body.length > 0
            && response.content_type
            && QueueProcessor.parsable_content_types.includes(response.content_type);
    }
}
QueueProcessor.parsable_content_types = [
    'text/html',
    'text/xml',
    'application/xml'
];
//# sourceMappingURL=queue-processor.js.map