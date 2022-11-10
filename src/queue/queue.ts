
// https://www.npmjs.com/package/better-queue
import BetterQueue, {ProcessFunction, Ticket} from "better-queue";
import {Method} from "got";
import Manager from "../manager/manager.js";
import Url from "../models/url.js";

export interface Job
{
    parent_url: Url|undefined;
    hit_url: Url;
    method: Method;
}

export interface Result
{
    hit_url: Url;
    status: number;
    source_url: Url|undefined;
}

export default class Queue
{
    manager: Manager;
    queue: BetterQueue;
    queued_urls: Set<string>;

    constructor(manager: Manager, batch_processor: ProcessFunction<any, any>)
    {
        this.manager = manager;
        this.queued_urls = new Set();
        this.queue = new BetterQueue({
            id: (task, cb) => {
                cb(null, task.hit_url.href);
            },
            cancelIfRunning: true,
            process: batch_processor,
            batchSize: 5, // The number of tasks (at most) that can be processed at once
            concurrent: 1 // Number of workers that can be running at any given time
        });
    }

    addJob(job: Job) : Ticket|undefined
    {
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