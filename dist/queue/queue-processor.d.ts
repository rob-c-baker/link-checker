import Queue, { Job, Result } from "./queue.js";
import Manager from "../manager/manager.js";
export default class QueueProcessor {
    queue: Queue;
    manager: Manager;
    constructor(queue: Queue, manager: Manager);
    processJob(job: Job): Promise<Result>;
}
