"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpResponse {
    constructor(request_url, body, status) {
        this.request_url = request_url;
        this.status = status;
        this.body = body;
    }
}
exports.default = HttpResponse;
//# sourceMappingURL=http-response.js.map