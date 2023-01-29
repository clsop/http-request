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
		setTimeout(timeout: number): void;
		setUrl(url: string): void;
		setMethod(method: HttpRequest.Method): void;
		setCredentials(credentials: HttpRequest.Credentials): void;
		abort(): void;
		execute(data?: D, additionalHeaders?: Record<string, string>): Promise<HttpRequest.IResponse<R>>;
	}
}

declare namespace HttpRequest {
	interface IResponse<T> {
		get headers(): Record<string, string>;
		get status(): number;
		get statusText(): string;
		get responseText(): string;
		get responseType(): string;
		get responseData(): T;
	}

	interface IFailureResponse extends IResponse<never> {
		get isServerError(): boolean;
		get isNotFound(): boolean;
		get isUnauthorized(): boolean;
		get isForbidden(): boolean;
	}

	interface IHttpRequestError extends Error {
		toString(): string;
	}

	interface IParams {
		method?: Method;
		url?: string;
		headers?: Record<string, string>;
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

	type Api = "FETCH" | "XHR"; // "WEBSOCKET"
	type Method = "GET" | "POST" | "PUT" | "HEAD" | "OPTIONS" | "PATCH" | "DELETE";
}