import SuccessReponse from "./succes_response";

export default class FailureResponse extends SuccessReponse<never> implements HttpRequest.IFailureResponse {
	constructor(status: number, statusText: string, headers: Record<string, string>,
		responseType: string, responseText: string) {
		super(status, statusText, headers, responseType, responseText);
	}

	public  isUnauthorized(): boolean {
		return this.getStatus() === 401;
	}

	public isForbidden(): boolean {
		return this.getStatus() === 403;
	}

	public isServerError(): boolean {
		return this.getStatus() === 500;
	}

	public isNotFound(): boolean {
		return this.getStatus() === 404;
	}
}