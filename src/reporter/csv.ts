
import fs from "fs";
import path from "path";
import Task from "../queue/task.js";

export default class Csv
{
    private file_stream: fs.WriteStream;

    constructor()
    {
        this.file_stream = fs.createWriteStream(path.normalize('./output/urls.csv'));
    }

    async header()
    {
        return this.write([
            'URL',
            'Status Code',
            'Source URL',
            'Date checked'
        ]);
    }

    async add(task: Task) : Promise<Task>
    {
        try {
            await this.write([
                task.hit_url.href,
                String(task.status),
                task.parent_url ? task.parent_url.href : '',
                (new Date()).toLocaleString()
            ]);
        } catch (e) {
            throw e;
        }
        return task;
    }

    async write(data: Array<string>)
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
                    return false;
                }
                resolve(true);
            });
        });
    }
}