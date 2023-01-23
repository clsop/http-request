import Response from './response';

export default class FailResponse extends Response<any> {
	constructor(status: number, statusText: string, headers: Map<string, string>,
		responseType: string) {
		super(status, statusText, headers, responseType, null, null);
	}

	public isServerError(): boolean {
		return this.getStatus() === 500;
	}

	public isNotFound(): boolean {
		return this.getStatus() === 404;
	}
}