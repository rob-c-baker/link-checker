
// https://www.npmjs.com/package/better-queue
import BetterQueue, {ProcessFunction, Ticket} from "better-queue";
import {Method} from "got";
import Manager from "../manager/manager";

export interface Job
{
    parent_url: URL|undefined;
    hit_url: URL;
    method: Method;
}

export interface Result
{
    hit_url: URL;
    status: number;
    source_url: URL|undefined;
}

export default class Queue
{
    manager: Manager;
    queue: BetterQueue;
    queued_urls: Array<string>;

    constructor(manager: Manager, batch_processor: ProcessFunction<any, any>)
    {
        this.manager = manager;
        this.queued_urls = [];
        this.queue = new BetterQueue({
            id: (task, cb) => {
                cb(null, task.hit_url.href);
            },
            process: batch_processor,
            batchSize: 5, // The number of tasks (at most) that can be processed at once
            concurrent: 1 // Number of workers that can be running at any given time
        });
    }

    isUrlQueued(url:string) : boolean
    {
        return this.queued_urls.indexOf(url) > -1;
    }

    markUrlQueued(url:string)
    {
        this.queued_urls.push(url);
    }

    addJob(job: Job) : Ticket|undefined
    {
        if (!this.isUrlQueued(job.hit_url.href)) {
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
}