import HttpError from './HttpError';

export default class HttpResponseError extends HttpError implements Http.IHttpResponseError {
	constructor(message: string, info: string, private ResponseType: string) {
		super('HttpResponseError', message, info);
	}

	public getResponseType(): string {
		return this.ResponseType;
	}
}