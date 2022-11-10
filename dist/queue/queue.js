// https://www.npmjs.com/package/better-queue
import BetterQueue from "better-queue";
export default class Queue {
    constructor(manager, batch_processor) {
        this.manager = manager;
        this.queued_urls = new Set();
        this.queue = new BetterQueue({
            id: (task, cb) => {
                cb(null, task.hit_url.href);
            },
            cancelIfRunning: true,
            process: batch_processor,
            batchSize: 5,
            concurrent: 1 // Number of workers that can be running at any given time
        });
    }
    addJob(job) {
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
//# sourceMappingURL=queue.js.map