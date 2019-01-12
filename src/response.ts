export default class Reponse<T> implements Http.IResponse<T> {
	constructor(private status: number, private statusText: string, private headers: Map<string, string>,
		private responseType: string, private responseText: string, private responseData: T) {
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