import HttpError from './http_error';

export default class HttpResponseError extends HttpError {
	constructor(message: string, info: string, private ResponseType: string) {
		super('HttpResponseError', message, info);
	}

	public getResponseType(): string {
		return this.ResponseType;
	}
}