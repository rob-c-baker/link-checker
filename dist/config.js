"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let instance = null;
class Config {
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
exports.default = Config;
//# sourceMappingURL=config.js.map