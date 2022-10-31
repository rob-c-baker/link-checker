"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manager_1 = __importDefault(require("../manager/manager"));
const parser_1 = __importDefault(require("../services/parser"));
const http_1 = __importDefault(require("../services/http"));
class QueueProcessor {
    constructor(queue, manager) {
        this.queue = queue;
        this.manager = manager;
    }
    processJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http_1.default.request(job.hit_url.href, job.method);
            if (response.status === 200 && response.body.length > 0) {
                const parser = new parser_1.default(response.body);
                const links = parser.filterLinks(parser.findLinks());
                for (const link of links) {
                    this.manager.queue.addJob({
                        parent_url: job.hit_url,
                        hit_url: link,
                        method: link.hostname === manager_1.default.base_url.hostname ? 'get' : 'head' // head method for external URLs
                    });
                }
            }
            return {
                source_url: job.parent_url,
                hit_url: job.hit_url,
                status: response.status,
            };
        });
    }
}
exports.default = QueueProcessor;
//# sourceMappingURL=queue-processor.js.map