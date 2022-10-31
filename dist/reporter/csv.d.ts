/// <reference types="node" />
import fs from "fs";
export default class Csv {
    file_stream: fs.WriteStream;
    constructor();
    writeHeader(): Promise<boolean>;
    addRow(url: string, status: number, source_url: string | null): Promise<boolean>;
    writeRow(data: Array<string>): Promise<boolean>;
}
