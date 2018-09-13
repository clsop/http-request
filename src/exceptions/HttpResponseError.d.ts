import HttpError from './HttpError';
export default class HttpResponseError extends HttpError implements Http.IHttpResponseError {
    private ResponseType;
    constructor(message: string, info: string, ResponseType: string);
    getResponseType(): string;
}
