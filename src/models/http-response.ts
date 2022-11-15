
export default class HttpResponse
{
    public request_url: string;
    public content_type: string;
    public is_xml: boolean;
    public status: number;
    public body: string;

    constructor(request_url: string, body: string, status: number, content_type: string|undefined)
    {
        this.request_url = request_url;
        this.status = status;
        this.body = body;

        // content based stuff:
        this.content_type = typeof content_type !== 'undefined'
            ? content_type.toLowerCase().split(';')[0].trim()
            : '';
        this.is_xml = this.content_type !== null && this.content_type.includes('xml');
    }
}