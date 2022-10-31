import BetterQueue, { ProcessFunction, Ticket } from "better-queue";
import { Method } from "got";
import Manager from "../manager/manager";
import Url from "../models/url";
export interface Job {
    parent_url: Url | undefined;
    hit_url: Url;
    method: Method;
}
export interface Result {
    hit_url: Url;
    status: number;
    source_url: Url | undefined;
}
export default class Queue {
    manager: Manager;
    queue: BetterQueue;
    queued_urls: Array<string>;
    constructor(manager: Manager, batch_processor: ProcessFunction<any, any>);
    isUrlQueued(url: string): boolean;
    markUrlQueued(url: string): void;
    addJob(job: Job): Ticket | undefined;
}
