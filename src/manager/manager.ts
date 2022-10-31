import Queue, {Job} from "../queue/queue.js";
import QueueProcessor from "../queue/queue-processor.js";
import chalk from 'chalk';
import Csv from "../reporter/csv.js";
import Url from "../models/url.js";
import Config from "../config.js";

export default class Manager
{
    static readonly config: Config = Config.instance();
    readonly queue_processor: QueueProcessor;
    readonly queue: Queue;
    readonly csv: Csv = new Csv();
    static base_url: Url;

    constructor(url: string)
    {
        const base_url = Url.normaliseURL(new Url(url));
        Manager.config.base_url = base_url.href;
        Manager.base_url = base_url;

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
    }

    init()
    {
        this.loggingEvents();
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

    async run()
    {
        await this.csv.writeHeader();

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
    }
}