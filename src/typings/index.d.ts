interface IBaseResponse<T> {
	setHeaders(headers: Map<string, string>): void;
	getHeaders(): Map<string, string>;
	getStatus(): number;
	getStatusText(): string;
	getResponseText(): string;
	getResponseType(): string;
	getResponseData(): T;
}

interface IFailResponse<T> extends IBaseResponse<T> {
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
	then(callback: (value: IBaseResponse<T>) => T | PromiseLike<T>): Promise<T>;
	catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IBaseResponse<T>>;
	cancel(): void;
	send(method?: string, data?: T): void;
}

type Data = string | Document | Blob | ArrayBuffer | ArrayBufferView | FormData | URLSearchParams | ReadableStream<Uint8Array>; 
type Method = "GET" | "POST" | "PUT" | "HEAD" | "OPTIONS" | "PATCH" | "DELETE";
interface IRequestApi<T> {
	setHeader(header: string, value: string): void;
	setTimeout(timeout: number): void;
	setUrl(url: string): void;
	setMethod(method: Method): void;
	abort(): void;
	execute(data?: Data): Promise<IBaseResponse<T>>;
}

type Resolver<T> = (value?: T | PromiseLike<T> | null) => void;