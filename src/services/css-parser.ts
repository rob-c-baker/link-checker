import Parser from "./parser.js";
import Url from "../models/url.js";
// @ts-ignore
import parseCssUrls from "css-url-parser";

export default class CssParser extends Parser
{
    findLinks(): Array<Url>
    {
        const links = parseCssUrls(this.body);
        const found_links = [];

        for (const link of links) {
            const url = new Url(link, this.base_url.href);
            found_links.push(Url.normaliseURL(url));
        }

        return found_links;
    }
}