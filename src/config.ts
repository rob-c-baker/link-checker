
let instance: Config|null = null;

export default class Config
{
    base_url: string = '';

    allowed_protocols: Array<string> = [
        'http',
        'https'
    ];

    static instance() : Config
    {
        if (instance === null) {
            instance = new Config()
        }
        return instance;
    }
}