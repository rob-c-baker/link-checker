import { JSDOM } from "jsdom";
import Url from "../models/url.js";
export default class Parser {
    body: string;
    dom: JSDOM;
    constructor(body: string);
    findLinks(): Array<Url>;
    filterLinks(links: Array<Url>): Array<Url>;
}
