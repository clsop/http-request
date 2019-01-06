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

type ProgressHandler = (event: IProgressEvent) => void;
interface IProgressEvent extends Event {
	loaded: number;
	total: number;
}

type Eagerness = "NOW" | "NO_HURRY" | "HURRY" | "PATIENT" | "REAL_PATIENT" | "WHENEVER";
interface IHttpRequest<T> {
	setPatience(eagerness?: Eagerness): void;
	setUrl(url: string): void;
	setHeader(header: string, value: string): void;
	setUseCredentials(useCredentials: boolean): void;
	setProgressHandler(callback: (this: XMLHttpRequest, e: IProgressEvent) => any): void;
	then(callback: (value: IResponse<T>) => T | PromiseLike<T>): Promise<T>;
	catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IResponse<T>>;
	cancel(): void;
	send(method?: string, data?: T): void;
}

type XhrData = string | Document | Blob | BufferSource | FormData | URLSearchParams | ReadableStream;
type FetchData = string | Blob | BufferSource | FormData | URLSearchParams;
type Method = "GET" | "POST" | "PUT" | "HEAD" | "OPTIONS" | "PATCH" | "DELETE";

/**
 * Interface for request api implementations
 * @type {R}
 * @type {D}
 */
interface IRequestApi<R, D> {
	setHeader(header: string, value: string): void;
	setTimeout(timeout: number): void;
	setUrl(url: string): void;
	setMethod(method: Method): void;
	abort(): void;
	execute(data?: D): Promise<IResponse<R>>;
}

type Resolver<T> = (value?: T | PromiseLike<T> | null | string) => void;