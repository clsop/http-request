import Response from './response';

export default class FailResponse<T> extends Response<T> implements IFailResponse<T> {
	constructor(status: number, statusText: string, headers: Map<string, string>,
		responseType: string, responseText: string, responseData: T) {
		super(status, statusText, headers, responseType, responseText, responseData);
	}

	public isServerError(): boolean {
		return this.getStatus() === 500;
	}

	public isNotFound(): boolean {
		return this.getStatus() === 404;
	}
}