import {JSDOM} from "jsdom";
import Url from "../models/url.js";
import Parser from "./parser.js";

export default class DomParser extends Parser
{
    protected dom: JSDOM;
    protected is_xml: boolean;

    constructor(body: string, base_url: Url, is_xml: boolean)
    {
        super(body, base_url);
        this.dom = new JSDOM(this.body);
        this.is_xml = is_xml;
        // @todo support SVG
    }

    findLinks() : Array<Url>
    {
        const links = [];

        if (!this.is_xml) {
            // links in attributes
            const nodes = Array.from(this.dom.window.document.querySelectorAll('[href],[src],[data-src]'));
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
        } else {
            // links in sitemaps / XML
            const locs = Array.from(this.dom.window.document.querySelectorAll('loc'));
            for (const loc of locs) {
                const url = Url.instance(String(loc.textContent).trim());
                if (url) {
                    links.push(Url.normaliseURL(url));
                }
            }
        }

        return links;
    }
}