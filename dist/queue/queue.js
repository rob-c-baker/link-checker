// https://www.npmjs.com/package/fastq
import * as fastq from "fastq";
import Manager from "../manager/manager.js";
import QueueProcessor from "./queue-processor.js";
import { Html } from "../validators/html.js";
export default class Queue {
    constructor(manager) {
        this.queued_urls = new Set();
        this._task_finished = (task) => { };
        QueueProcessor.validators.push(new Html());
        this.manager = manager;
        this.queue_processor = new QueueProcessor(manager);
        this.q = fastq.promise(this.queue_processor.processJob.bind(this.queue_processor), Manager.config.concurrency);
    }
    set task_finished(value) {
        this._task_finished = value;
    }
    add(task) {
        if (this.queued_urls.has(task.id)) {
            return Promise.resolve(task);
        }
        this.queued_urls.add(task.id);
        return this.q.push(task).then(task => {
            return this.manager.csv.add(task);
        }).then(task => {
            this._task_finished(task);
            return task;
        });
    }
}
//# sourceMappingURL=queue.js.map