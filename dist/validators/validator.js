export class Validator {
    constructor(body, content_type) {
        this._errors = [];
        this.body = body !== null && body !== void 0 ? body : '';
        this.content_type = content_type !== null && content_type !== void 0 ? content_type : '';
    }
    get errors() {
        return this._errors;
    }
    set errors(value) {
        this._errors = value;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    setContentType(content_type) {
        this.content_type = content_type;
        return this;
    }
}
//# sourceMappingURL=validator.js.map