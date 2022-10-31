"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Csv {
    constructor() {
        this.file_stream = fs_1.default.createWriteStream(path_1.default.normalize('./output/urls.csv'));
    }
    writeHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.writeRow([
                'URL',
                'Status Code',
                'Source URL',
                'Date checked'
            ]);
        });
    }
    addRow(url, status, source_url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.writeRow([
                url,
                String(status),
                source_url !== null && source_url !== void 0 ? source_url : '',
                (new Date()).toLocaleString()
            ]);
        });
    }
    writeRow(data) {
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
                        return;
                    }
                    resolve(true);
                });
            });
        });
    }
}
exports.default = Csv;
//# sourceMappingURL=csv.js.map