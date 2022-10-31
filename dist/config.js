let instance = null;
export default class Config {
    constructor() {
        this.base_url = '';
        this.allowed_protocols = [
            'http',
            'https'
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