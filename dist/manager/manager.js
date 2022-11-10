var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Queue from "../queue/queue.js";
import QueueProcessor from "../queue/queue-processor.js";
import chalk from 'chalk';
import Csv from "../reporter/csv.js";
import Url from "../models/url.js";
import Config from "../config.js";
export default class Manager {
    constructor(url) {
        this.csv = new Csv();
        const base_url = Url.normaliseURL(new Url(url));
        Manager.config.base_url = base_url.href;
        Manager.base_url = base_url;
        this.queue = new Queue(this, (batch, cb) => {
            const promises = [];
            for (const job of batch) {
                promises.push(this.queue_processor.processJob(job));
            }
            Promise.all(promises).then(results => {
                cb(null, results);
            });
        });
        this.queue_processor = new QueueProcessor(this.queue, this);
    }
    init() {
        this.loggingEvents();
    }
    loggingEvents() {
        this.queue.queue.on('task_finish', (taskId, results, stats) => {
            console.log(chalk.green('[Done] ') + taskId);
        });
        this.queue.queue.on('task_failed', (taskId, err, stats) => {
            console.log(chalk.red('[Error] ') + taskId + ' - ' + err);
        });
        // when there are no more tasks on the queue and when no more tasks are running.
        this.queue.queue.on('drain', () => {
            console.log(chalk.green('COMPLETE!'));
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
Manager.config = Config.instance();
//# sourceMappingURL=manager.js.map