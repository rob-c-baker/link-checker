"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const config_1 = __importDefault(require("../config"));
const url_1 = __importDefault(require("../models/url"));
class Parser {
    constructor(body) {
        this.body = body;
        this.dom = new jsdom_1.JSDOM(this.body);
    }
    findLinks() {
        const links = [];
        // links in attributes
        const nodes = this.dom.window.document.querySelectorAll('[href],[src],[data-src]');
        for (const node of nodes) {
            let link = '';
            if (node.hasAttribute('href')) {
                link = String(node.getAttribute('href'));
            }
            else if (node.hasAttribute('src')) {
                link = String(node.getAttribute('src'));
            }
            else if (node.hasAttribute('data-src')) {
                link = String(node.getAttribute('data-src'));
            }
            const url = url_1.default.instance(link);
            if (url) {
                links.push(url_1.default.normaliseURL(url));
            }
        }
        // links in sitemaps
        const locs = this.dom.window.document.querySelectorAll('loc');
        for (const loc of locs) {
            const url = url_1.default.instance(String(loc.textContent).trim());
            if (url) {
                links.push(url_1.default.normaliseURL(url));
            }
        }
        return links;
    }
    filterLinks(links) {
        const config = config_1.default.instance();
        for (let idx = 0; idx < links.length; idx++) {
            for (const protocol of config.allowed_protocols) {
                if (!links[idx].protocol.startsWith(protocol)) {
                    links.splice(idx, 1);
                }
            }
        }
        return links;
    }
}
exports.default = Parser;
//# sourceMappingURL=parser.js.map