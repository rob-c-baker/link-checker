
export interface ValidatorError
{
    message: string;
    data?: {}
}

export abstract class Validator
{
    public body: string;
    public content_type: string;
    private _errors: Array<ValidatorError> = [];

    constructor(body?: string|undefined, content_type?:string|undefined)
    {
        this.body = body ?? '';
        this.content_type = content_type ?? '';
    }

    abstract canValidate() : boolean;
    abstract isValid() : boolean;

    get errors(): Array<ValidatorError> {
        return this._errors;
    }

    set errors(value: Array<ValidatorError>) {
        this._errors = value;
    }

    setBody(body: string) : this
    {
        this.body = body;
        return this;
    }

    setContentType(content_type: string) : this
    {
        this.content_type = content_type;
        return this;
    }
}
