import Queue, {Job, Result} from "./queue";
import Manager from "../manager/manager";
import Parser from "../parser/parser";

export default class QueueProcessor
{
    queue: Queue;
    manager: Manager;

    constructor(queue: Queue, manager: Manager)
    {
        this.queue = queue;
        this.manager = manager;
    }

    async processJob(job: Job) : Promise<Result>
    {
        const response = await Manager.httpRequest(job.hit_url.href, job.method);

        if (response.status === 200 && response.body.length > 0) {
            const parser = new Parser(response.body);
            const links = parser.findLinks();
            for (const link of links) {
                let url: URL;
                if (link.startsWith('http')) {
                    url = new URL(link);
                } else {
                    url = new URL(link, Manager.base_url.href);
                }
                if (['http:', 'https:'].indexOf(url.protocol) > -1) {
                    this.manager.queue.addJob({
                        parent_url: job.hit_url,
                        hit_url: url,
                        method: url.hostname === Manager.base_url.hostname ? 'get' : 'head' // head method for external URLs
                    });
                }
            }
        }

        return {
            source_url: job.parent_url,
            hit_url: job.hit_url,
            status: response.status,
        };
    }
}