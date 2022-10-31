"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const sanitize_url_1 = require("@braintree/sanitize-url");
class Url extends URL {
    /**
     *
     * @param url
     * @param (base_url)
     */
    constructor(url, base_url) {
        super(url, base_url);
    }
    clone() {
        return new Url(this.href);
    }
    static instance(url) {
        const sanitised_url = Url.sanitiseUrl(url);
        if (!sanitised_url) {
            return null;
        }
        if (url.startsWith('http')) {
            return new Url(url);
        }
        return new Url(url, config_1.default.instance().base_url);
    }
    static normaliseURL(url) {
        if (url.hash) { // don't care about hashes
            url.hash = '';
        }
        // hostname should always be lower case
        url.host = url.host.toLowerCase();
        // so we don't get differences in the search params
        url.searchParams.sort();
        // remove trailing slash
        url.pathname = url.pathname.replace(/\/$/, '');
        return url;
    }
    static sanitiseUrl(url) {
        const new_url = (0, sanitize_url_1.sanitizeUrl)(url);
        if (!new_url) {
            return null;
        }
        if (new_url === 'about:blank') {
            return null;
        }
        return new_url;
    }
}
exports.default = Url;
//# sourceMappingURL=url.js.map