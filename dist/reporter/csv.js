var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import path from "path";
export default class Csv {
    constructor() {
        this.file_stream = fs.createWriteStream(path.normalize('./output/urls.csv'));
    }
    header() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.write([
                'URL',
                'Status Code',
                'Source URL',
                'Date checked'
            ]);
        });
    }
    add(task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.write([
                    task.hit_url.href,
                    String(task.status),
                    task.parent_url ? task.parent_url.href : '',
                    (new Date()).toLocaleString()
                ]);
            }
            catch (e) {
                throw e;
            }
            return task;
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return new Promise((resolve, reject) => {
                this.file_stream.write(escaped_data.join(',') + "\n", 'utf-8', error => {
                    if (error) {
                        reject(error);
                        return false;
                    }
                    resolve(true);
                });
            });
        });
    }
}
//# sourceMappingURL=csv.js.map