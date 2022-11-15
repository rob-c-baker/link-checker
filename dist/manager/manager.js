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
import chalk from 'chalk';
import Csv from "../reporter/csv.js";
import Url from "../models/url.js";
import Config from "../config.js";
import Task from "../queue/task.js";
export default class Manager {
    constructor(url) {
        this.queue = new Queue(this);
        this.csv = new Csv();
        const base_url = Url.normaliseURL(new Url(url));
        Manager.config.base_url = base_url.href;
        Manager.base_url = base_url;
    }
    init() {
        this.loggingEvents();
    }
    loggingEvents() {
        this.queue.q.error((err, task) => {
            if (err) {
                console.log(chalk.red('[Error] ') + ` ${task.id} ${err}`);
                throw err; // so
            }
        });
        this.queue.q.drained().then(() => {
            console.log(chalk.green('COMPLETE!'));
        });
        this.queue.task_finished = (task) => {
            console.log(chalk.green('[Done]') + ` ${task.id} ${task.content_type}`);
        };
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // sitemap.xml based off Manager.base_url
            const sitemap_xml_url = Manager.base_url.clone();
            sitemap_xml_url.pathname = '/sitemap.xml';
            try {
                yield this.csv.header();
                return Promise.all([
                    this.queue.add(new Task(Manager.base_url, 'get', undefined)),
                    this.queue.add(new Task(sitemap_xml_url, 'get', Manager.base_url))
                ]);
            }
            catch (err) {
                process.exit(1);
            }
            process.exit(0);
        });
    }
}
Manager.config = Config.instance();
//# sourceMappingURL=manager.js.map