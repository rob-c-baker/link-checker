
import md5 from "md5";

export default class Url
{
    url: string;

    constructor(url: string)
    {
        this.url = Url.normalise(url);
    }

    static normalise(url: string) : string
    {
        return url;
    }

    getHash() : string
    {
        return md5(this.url);
    }
}