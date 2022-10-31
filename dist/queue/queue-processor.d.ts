import Queue, { Job, Result } from "./queue";
import Manager from "../manager/manager";
export default class QueueProcessor {
    queue: Queue;
    manager: Manager;
    constructor(queue: Queue, manager: Manager);
    processJob(job: Job): Promise<Result>;
}
