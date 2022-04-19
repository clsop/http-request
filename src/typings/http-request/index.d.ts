// /// promise stuff
// type Resolve<T> = (value?: T | PromiseLike<T>) => void;
// type Reject = (reason?: any) => void;

// type Resolver<T> = (value?: T | PromiseLike<T> | null | string) => void;

// interface IParamsInternal extends Http.IParams {
// 	timeout?: number;
// }

// /**
//  * Interface for request api implementations
//  * @type {R} returned data model
//  * @type {D} request data model
//  */
// interface IRequestApi<R, D> {
// 	setHeader(header: string, value: string): void;
// 	setTimeout(timeout: number): void;
// 	setUrl(url: string): void;
// 	setMethod(method: Http.Method): void;
// 	setCredentials(credentials: Http.Credentials): void;
// 	abort(): void;
// 	execute(data?: D): Promise<Http.IResponse<R>>;
// }

declare namespace HttpRequest.Internal {
	/// promise stuff
	type Resolve<T> = (value?: T | PromiseLike<T>) => void;
	type Reject = (reason?: any) => void;

	type Resolver<T> = (value?: T | PromiseLike<T> | null | string) => void;

	interface IParams extends HttpRequest.IParams {
		timeout?: number;
	}

	/**
		 * Interface for request api implementations
		 * @type {R} returned data model
		 * @type {D} request data model
		 */
	interface IRequestApi<R, D> {
		setHeader(header: string, value: string): void;
		setTimeout(timeout: number): void;
		setUrl(url: string): void;
		setMethod(method: HttpRequest.Method): void;
		setCredentials(credentials: HttpRequest.Credentials): void;
		abort(): void;
		execute(data?: D): Promise<HttpRequest.IResponse<R>>;
	}
}

declare module HttpRequest {
	interface IResponse<T> {
		getHeaders(): Map<string, string>;
		getStatus(): number;
		getStatusText(): string;
		getResponseText(): string;
		getResponseType(): string;
		getResponseData(): T;
	}

	interface IFailResponse<T> extends IResponse<T> {
		isServerError(): boolean;
		isNotFound(): boolean;
	}

	interface IHttpRequestError extends Error {
		toString(): string;
	}

	interface IHttpResponseError extends IHttpRequestError {
		getResponseType(): string;
	}

	interface IParams {
		method?: Method;
		url?: string;
		headers?: Map<string, string>;
		credentials?: Credentials;
	}

	/**
	 * Initial request parameters
	 */
	interface IParameters extends IParams {
		eagerness?: Eagerness;
	}

	interface Credentials {
		username: string;
		password: string;
	}

	/**
	 * Wrapper interface for http request api
	 * @type {R}
	 * @type {D}
	 */
	interface IHttpRequest<R, D> {
		setPatience(eagerness: Eagerness): void;
		setUrl(url: string): void;
		setHeader(header: string, value: string): void;
		setCredentials(credentials: Credentials): void;
		abort(): void;
		send(method?: Method, data?: D): Promise<IResponse<R>>;
	}

	/**
	 * The patience of the request related to a timeout
	 * @type {String}
	 */
	type Eagerness = "NOW" | "NO_HURRY" | "HURRY" | "PATIENT" | "REAL_PATIENT" | "WHENEVER";

	type Api = "FETCH" | "XHR";
	type Method = "GET" | "POST" | "PUT" | "HEAD" | "OPTIONS" | "PATCH" | "DELETE";
}