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
const queue_1 = __importDefault(require("../queue/queue"));
const queue_processor_1 = __importDefault(require("../queue/queue-processor"));
const chalk_1 = __importDefault(require("chalk"));
const csv_1 = __importDefault(require("../reporter/csv"));
const url_1 = __importDefault(require("../models/url"));
const config_1 = __importDefault(require("../config"));
class Manager {
    constructor(url) {
        this.csv = new csv_1.default();
        const base_url = url_1.default.normaliseURL(new url_1.default(url));
        Manager.config.base_url = base_url.href;
        Manager.base_url = base_url;
        this.queue = new queue_1.default(this, (batch, cb) => {
            const promises = [];
            for (const job of batch) {
                promises.push(this.queue_processor.processJob(job));
            }
            Promise.all(promises).then(results => {
                cb(null, results);
            });
        });
        this.queue_processor = new queue_processor_1.default(this.queue, this);
    }
    init() {
        this.loggingEvents();
    }
    loggingEvents() {
        this.queue.queue.on('task_finish', (taskId, result, stats) => {
            console.log(chalk_1.default.green('[Done] ') + taskId);
        });
        this.queue.queue.on('task_failed', (taskId, err, stats) => {
            console.log(chalk_1.default.red('[Error] ') + taskId + ' - ' + err);
        });
        // when there are no more tasks on the queue and when no more tasks are running.
        this.queue.queue.on('drain', () => {
            console.log('COMPLETE!');
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.csv.writeHeader();
            // add some jobs to start things off:
            // the base URL
            this.queue.addJob({
                parent_url: undefined,
                hit_url: Manager.base_url,
                method: 'get'
            });
            const sitemap_xml_url = Manager.base_url.clone();
            sitemap_xml_url.pathname = '/sitemap.xml';
            // sitemap.xml
            this.queue.addJob({
                parent_url: Manager.base_url,
                hit_url: sitemap_xml_url,
                method: 'get'
            });
        });
    }
}
exports.default = Manager;
Manager.config = config_1.default.instance();
//# sourceMappingURL=manager.js.map