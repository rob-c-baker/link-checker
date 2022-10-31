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
const got_1 = __importDefault(require("got"));
const http_response_1 = __importDefault(require("../models/http-response"));
class Http {
    /**
     * @param url
     * @param method
     */
    static request(url, method = 'head') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, got_1.default)(url, {
                method: method,
                throwHttpErrors: false
            });
            return new http_response_1.default(url, response.body, response.statusCode);
        });
    }
}
exports.default = Http;
//# sourceMappingURL=http.js.map