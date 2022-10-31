"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://www.npmjs.com/package/better-queue
const better_queue_1 = __importDefault(require("better-queue"));
class Queue {
    constructor(manager, batch_processor) {
        this.manager = manager;
        this.queued_urls = [];
        this.queue = new better_queue_1.default({
            id: (task, cb) => {
                cb(null, task.hit_url.href);
            },
            process: batch_processor,
            batchSize: 5,
            concurrent: 1 // Number of workers that can be running at any given time
        });
    }
    isUrlQueued(url) {
        return this.queued_urls.indexOf(url) > -1;
    }
    markUrlQueued(url) {
        this.queued_urls.push(url);
    }
    addJob(job) {
        if (this.isUrlQueued(job.hit_url.href)) {
            return;
        }
        this.markUrlQueued(job.hit_url.href);
        return this.queue.push(job, (err, results) => {
            if (err) {
                throw err;
            }
            // results is an array of `Result` objects
            for (const result of results) {
                this.manager.csv.addRow(result.hit_url.href, result.status, result.source_url ? result.source_url.href : null);
            }
        });
    }
}
exports.default = Queue;
//# sourceMappingURL=queue.js.map