import Queue, {Job, Result} from "./queue";
import Manager from "../manager/manager";
import Parser from "../services/parser";
import Http from "../services/http";

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
        const response = await Http.request(job.hit_url.href, job.method);

        if (response.status === 200 && response.body.length > 0) {

            const parser = new Parser(response.body);
            const links = parser.filterLinks(parser.findLinks());

            for (const link of links) {
                this.manager.queue.addJob({
                    parent_url: job.hit_url,
                    hit_url: link,
                    method: link.hostname === Manager.base_url.hostname ? 'get' : 'head' // head method for external URLs
                });
            }
        }

        return {
            source_url: job.parent_url,
            hit_url: job.hit_url,
            status: response.status,
        };
    }
}