
import { writeToStream } from '@fast-csv/format';
import fs from "fs";
import path from "path";

export default class Csv
{
    file_stream: fs.WriteStream;

    constructor()
    {
        this.file_stream = fs.createWriteStream(path.normalize('./output/urls.csv'));

        // header
        writeToStream(this.file_stream, [[
            'URL',
            'Status Code',
            'Source URL'
        ]]);
    }

    addRow(url:string, status:number, source_url:string|null)
    {
        writeToStream(this.file_stream, [[
            url,
            status,
            source_url ?? ''
        ]]);
    }
}