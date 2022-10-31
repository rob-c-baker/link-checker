export default class HttpResponse {
    request_url: string;
    status: number;
    body: string;
    constructor(request_url: string, body: string, status: number);
}
