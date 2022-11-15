import Url from "../models/url.js";
import Config from "../config.js";

export default abstract class Parser
{
    protected body: string;
    protected base_url: Url;

    constructor(body: string, base_url: Url)
    {
        this.body = body;
        this.base_url = base_url;
        // @todo support site.manifest
    }

    abstract findLinks() : Array<Url>;

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

    getLinks() : Array<Url>
    {
        return this.filterLinks(this.findLinks());
    }
}