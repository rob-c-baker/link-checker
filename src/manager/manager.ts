import Queue from "../queue/queue.js";
import chalk from 'chalk';
import Csv from "../reporter/csv.js";
import Url from "../models/url.js";
import Config from "../config.js";
import Task from "../queue/task.js";

export default class Manager
{
    public static readonly config: Config = Config.instance();
    public readonly queue: Queue = new Queue(this);
    public readonly csv: Csv = new Csv();
    public static base_url: Url;

    constructor(url: string)
    {
        const base_url = Url.normaliseURL(new Url(url));
        Manager.config.base_url = base_url.href;
        Manager.base_url = base_url;
    }

    init()
    {
        this.loggingEvents();
    }

    loggingEvents()
    {
        this.queue.q.error((err: Error, task: Task) => {
            if (err) {
                console.log(
                    chalk.red('[Error] ') + ` ${task.id} ${err}`
                );
                throw err; // so
            }
        });

        this.queue.q.drained().then(() => {
            console.log(chalk.green('COMPLETE!'));
        });

        this.queue.task_finished = (task: Task) => {
            console.log(
                chalk.green('[Done]') + ` ${task.id} ${task.content_type}`
            );
        };
    }

    async run()
    {
        // sitemap.xml based off Manager.base_url
        const sitemap_xml_url = Manager.base_url.clone();
        sitemap_xml_url.pathname = '/sitemap.xml';

        try {
            await this.csv.header();

            return Promise.all([
                this.queue.add(new Task(Manager.base_url, 'get', undefined)), // the base URL
                this.queue.add(new Task(sitemap_xml_url, 'get', Manager.base_url))
            ]);
        } catch (err) {
            process.exit(1);
        }

        process.exit(0);
    }
}