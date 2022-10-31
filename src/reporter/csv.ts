
import fs from "fs";
import path from "path";

export default class Csv
{
    file_stream: fs.WriteStream;

    constructor()
    {
        this.file_stream = fs.createWriteStream(path.normalize('./output/urls.csv'));
    }

    async writeHeader()
    {
        return this.writeRow([
            'URL',
            'Status Code',
            'Source URL',
            'Date checked'
        ]);
    }

    async addRow(url:string, status:number, source_url:string|null)
    {
        return this.writeRow([
            url,
            String(status),
            source_url ?? '',
            (new Date()).toLocaleString()
        ]);
    }

    async writeRow(data: Array<string>)
    {
        const escaped_data = data.map((element, index) => {
            if (element.indexOf('"') > -1) {
                element = element.replace(/"/, '""');
            }
            if (element.indexOf(",") > -1
                || element.indexOf("\n") > -1
                || element.indexOf("'") > -1
                || element.indexOf("\\") > -1
                || element.indexOf('"')) {
                element = '"' + element + '"';
            }
            return element;
        });
        return new Promise<boolean>((resolve, reject) => {
            this.file_stream.write(escaped_data.join(',') + "\n", 'utf-8', error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(true);
            });
        });
    }
}