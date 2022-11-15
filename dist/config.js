let instance = null;
export default class Config {
    constructor() {
        this.base_url = '';
        this.concurrency = 5;
        this.allowed_protocols = [
            'http',
            'https'
        ];
        this.dom_content_types = [
            'text/html',
            'text/xml',
            'application/xml'
        ];
        this.css_content_types = [
            'text/css'
        ];
    }
    static instance() {
        if (instance === null) {
            instance = new Config();
        }
        return instance;
    }
}
//# sourceMappingURL=config.js.map