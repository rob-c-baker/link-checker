export default class Url extends URL {
    /**
     *
     * @param url
     * @param (base_url)
     */
    constructor(url: string, base_url?: string);
    clone(): Url;
    static instance(url: string): Url | null;
    static normaliseURL(url: Url): Url;
    static sanitiseUrl(url: string): string | null;
}
