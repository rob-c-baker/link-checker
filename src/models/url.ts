import Config from "../config";
import {sanitizeUrl} from "@braintree/sanitize-url";

export default class Url extends URL
{
    /**
     *
     * @param url
     * @param (base_url)
     */
    constructor(url: string, base_url?: string)
    {
        super(url, base_url)
    }

    clone()
    {
        return new Url(this.href);
    }

    static instance(url: string) : Url | null
    {
        const sanitised_url = Url.sanitiseUrl(url);
        if (!sanitised_url) {
            return null;
        }
        if (url.startsWith('http')) {
            return new Url(url);
        }
        return new Url(url, Config.instance().base_url);
    }

    static normaliseURL(url: Url) : Url
    {
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

    static sanitiseUrl(url: string) : string | null
    {
        const new_url = sanitizeUrl(url);
        if (!new_url) {
            return null;
        }
        if (new_url === 'about:blank') {
            return null;
        }
        return new_url;
    }
}