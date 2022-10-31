import Queue from "../queue/queue";
import QueueProcessor from "../queue/queue-processor";
import Csv from "../reporter/csv";
import Url from "../models/url";
import Config from "../config";
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
