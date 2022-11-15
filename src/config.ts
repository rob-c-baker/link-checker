
let instance: Config|null = null;

export default class Config
{
    public base_url: string = '';

    public concurrency: number = 5;

    public allowed_protocols: Array<string> = [
        'http',
        'https'
    ];

    public dom_content_types: Array<string> = [
        'text/html',
        'text/xml',
        'application/xml'
    ];

    public css_content_types: Array<string> = [
        'text/css'
    ];

    static instance() : Config
    {
        if (instance === null) {
            instance = new Config()
        }
        return instance;
    }
}