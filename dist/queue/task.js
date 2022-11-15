export default class Task {
    constructor(hit_url, method, parent_url) {
        // below populated after processing:
        this.status = 0;
        this.content_type = '';
        this.validator_errors = [];
        this.id = hit_url.href;
        this.hit_url = hit_url;
        this.method = method;
        this.parent_url = parent_url;
    }
}
//# sourceMappingURL=task.js.map