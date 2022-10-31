import Queue from "../queue/queue.js";
import QueueProcessor from "../queue/queue-processor.js";
import Csv from "../reporter/csv.js";
import Url from "../models/url.js";
import Config from "../config.js";
export default class Manager {
    static readonly config: Config;
    readonly queue_processor: QueueProcessor;
    readonly queue: Queue;
    readonly csv: Csv;
    static base_url: Url;
    constructor(url: string);
    init(): void;
    loggingEvents(): void;
    run(): Promise<void>;
}
