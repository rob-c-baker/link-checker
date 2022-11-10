export default class HttpResponse {
    constructor(request_url, body, status, content_type) {
        this.request_url = request_url;
        this.status = status;
        this.body = body;
        // content based stuff:
        this.content_type = typeof content_type !== 'undefined'
            ? content_type.toLowerCase().split(';')[0].trim()
            : '';
        this.is_xml = this.content_type !== null && this.content_type.includes('xml');
    }
}
//# sourceMappingURL=http-response.js.map