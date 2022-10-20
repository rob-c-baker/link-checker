import Queue, {Job} from "../queue/queue";
import HttpResponse from "../models/http-response";
import QueueProcessor from "../queue/queue-processor";
import got from "got";
import {Method} from "got";
import chalk from 'chalk';
import Csv from "../reporter/csv";

export default class Manager
{
    readonly queue_processor: QueueProcessor;
    readonly queue: Queue;
    readonly csv: Csv;
    static base_url: URL;

    constructor(base_url: string)
    {
        this.queue = new Queue(this, (batch: Array<Job>, cb: Function) => {
            const promises = [];
            for (const job of batch) {
                promises.push(this.queue_processor.processJob(job))
            }
            Promise.all(promises).then(results => {
                cb(null, results);
            });
        });

        this.queue_processor = new QueueProcessor(this.queue, this);
        Manager.base_url = new URL(base_url);
        this.csv = new Csv();
    }

    loggingEvents()
    {
        this.queue.queue.on('task_finish', (taskId: any, result: any, stats: any) => {
            console.log(
                chalk.green('[Done] ') + taskId
            );
        });

        this.queue.queue.on('task_failed', (taskId: any, err: any, stats: any) => {
            console.log(
                chalk.red('[Error] ') + taskId + ' - ' + err
            );
        });

        // when there are no more tasks on the queue and when no more tasks are running.
        this.queue.queue.on('drain', () => {
            console.log('COMPLETE!');
        });
    }

    run()
    {
        // add a job to start things off
        this.queue.addJob({
            parent_url: undefined,
            hit_url: new URL(Manager.base_url),
            method: 'get'
        });
    }

    /**
     * @param url
     * @param method
     */
    static async httpRequest(url: string, method: Method='head') : Promise<HttpResponse>
    {
        const response = await got(url, {
            method: method,
            throwHttpErrors: false
        });
        return new HttpResponse(url, response.rawBody.toString(), response.statusCode);
    }
}