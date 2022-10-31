export default class Config {
    base_url: string;
    allowed_protocols: Array<string>;
    static instance(): Config;
}
