import Response from './Response';

export default class FailResponse<T> extends Response<T> implements IFailResponse<T> {
	constructor(status: number, statusText: string,
		responseType: string, responseText: string, responseData: T) {
		 super(status, statusText, responseType, responseText, responseData);
	}

	public isServerError(): boolean {
		return this.getStatus() === 500;
	}

	public isNotFound(): boolean {
		return this.getStatus() === 404;
	}
}