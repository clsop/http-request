import HttpError from './HttpError';
export default class HttpRequestError extends HttpError implements Http.IHttpRequestError {
    constructor(message: string, info: string);
}
