import HttpError from './http_error';

export default class HttpRequestError extends HttpError implements Http.IHttpRequestError {
	constructor(message: string, info: string) {
		super('HttpRequestError', message, info);
	}
}