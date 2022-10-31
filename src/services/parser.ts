import {JSDOM} from "jsdom";
import Config from "../config.js";
import Url from "../models/url.js";

export default class Parser
{
    body: string;
    dom: JSDOM;

    constructor(body: string)
    {
        this.body = body;
        this.dom = new JSDOM(this.body);
    }

    findLinks() : Array<Url>
    {
        const links = [];

        // links in attributes
        const nodes = this.dom.window.document.querySelectorAll('[href],[src],[data-src]');
        for (const node of nodes) {
            let link = '';
            if (node.hasAttribute('href')) {
                link = String(node.getAttribute('href'));
            } else if (node.hasAttribute('src')) {
                link = String(node.getAttribute('src'));
            } else if (node.hasAttribute('data-src')) {
                link = String(node.getAttribute('data-src'));
            }
            const url = Url.instance(link);
            if (url) {
                links.push(Url.normaliseURL(url));
            }
        }

        // links in sitemaps
        const locs = this.dom.window.document.querySelectorAll('loc');
        for (const loc of locs) {
            const url = Url.instance(String(loc.textContent).trim());
            if (url) {
                links.push(Url.normaliseURL(url));
            }
        }

        return links;
    }

    filterLinks(links: Array<Url>) : Array<Url>
    {
        const config = Config.instance();
        for (let idx=0; idx < links.length; idx++) {
            for (const protocol of config.allowed_protocols) {
                if (!links[idx].protocol.startsWith(protocol)) {
                    links.splice(idx, 1);
                }
            }
        }
        return links;
    }
}