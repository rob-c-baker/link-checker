import {JSDOM} from "jsdom";

export default class Parser
{
    body:string;
    dom:JSDOM;

    constructor(body: string)
    {
        this.body = body;
        this.dom = new JSDOM(this.body);
    }

    findLinks()
    {
        const links = [];
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
            links.push(link);
        }
        return links;
    }
}