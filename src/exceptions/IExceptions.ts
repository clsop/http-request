namespace Http {
	export interface IHttpRequestError extends Error {
		toString(): string;
	}

	export interface IHttpResponseError extends IHttpRequestError {
		getResponseType(): string;
	}
}
