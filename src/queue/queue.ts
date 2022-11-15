import type {queueAsPromised} from "fastq";
// https://www.npmjs.com/package/fastq
import * as fastq from "fastq";
import Manager from "../manager/manager.js";
import QueueProcessor from "./queue-processor.js";
import Task from "./task.js";
import {Html} from "../validators/html.js";

type TaskFinished = (type: Task) => void;

export default class Queue
{
    private readonly manager: Manager;
    public readonly q: queueAsPromised<Task>;
    private readonly queued_urls: Set<string> = new Set();
    private readonly queue_processor: QueueProcessor;

    private _task_finished: TaskFinished = (task: Task) => {};

    set task_finished(value: TaskFinished) {
        this._task_finished = value;
    }

    constructor(manager: Manager)
    {
        QueueProcessor.validators.push(new Html());

        this.manager = manager;
        this.queue_processor = new QueueProcessor(manager);
        this.q = fastq.promise(
            this.queue_processor.processJob.bind(this.queue_processor),
            Manager.config.concurrency
        );
    }

    add(task: Task) : Promise<Task>
    {
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