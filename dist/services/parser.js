import Config from "../config.js";
export default class Parser {
    constructor(body, base_url) {
        this.body = body;
        this.base_url = base_url;
        // @todo support site.manifest
    }
    filterLinks(links) {
        const config = Config.instance();
        for (let idx = 0; idx < links.length; idx++) {
            for (const protocol of config.allowed_protocols) {
                if (!links[idx].protocol.startsWith(protocol)) {
                    links.splice(idx, 1);
                }
            }
        }
        return links;
    }
    getLinks() {
        return this.filterLinks(this.findLinks());
    }
}
//# sourceMappingURL=parser.js.map