import { IBaseResponse } from './IResponse';

export default class Reponse<T> implements IBaseResponse<T> {
	private headers: Map<string, string>;

	constructor(private status: number, private statusText: string, private responseType: string,
		private responseText: string, private responseData: T = null) { }

	public setHeaders(headers: Map<string, string>) {
		this.headers = headers;
	}

	public getHeaders(): Map<string, string> {
		return this.headers;
	}

	public getStatus(): number {
		return this.status;
	}

	public getStatusText(): string {
		return this.statusText;
	}

	public getResponseText(): string {
		return this.responseText;
	}

	public getResponseType(): string {
		return this.responseType;
	}

	public getResponseData(): T {
		return this.responseData;
	}
}