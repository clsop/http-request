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

/**
 * The patience of the request related to a timeout
 * @type {String}
 */
type Eagerness = "NOW" | "NO_HURRY" | "HURRY" | "PATIENT" | "REAL_PATIENT" | "WHENEVER";

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

type Api = "FETCH" | "XHR";
type Method = "GET" | "POST" | "PUT" | "HEAD" | "OPTIONS" | "PATCH" | "DELETE";

type Resolver<T> = (value?: T | PromiseLike<T> | null | string) => void;