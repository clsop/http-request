declare namespace Http {
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

	type Eagerness = "NOW" | "NO_HURRY" | "HURRY" | "PATIENT" | "REAL_PATIENT" | "WHENEVER";
	interface IHttpRequest<T> {
		setPatience(eagerness?: Eagerness): void;
		setUrl(url: string): void;
		setHeader(header: string, value: string): void;
		useCreadentials(useThem: boolean): void;
		setProgressHandler(callback: (this: XMLHttpRequest, e: IProgressEvent) => any): void;
		then(callback: (value: IBaseResponse<T>) => T | PromiseLike<T>): Promise<T>;
		catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IBaseResponse<T>>;
		cancel(): void;
		send(method?: string, data?: T): void;
	}

	type Resolver<T> = (value?: T | PromiseLike<T> | null) => void;

	class HttpRequest<T> implements IHttpRequest<T> {
		private readonly headers;
		private readonly methods;
		private url;
		private useCredentials;
		private username;
		private password;
		private promise;
		private xhr;
		constructor(url: string, eagerness?: Eagerness, useCredentials?: boolean, username?: string, password?: string);
		private eventHook;
		private validUrl;
		setPatience(eagerness?: Eagerness): void;
		setUrl(url: string): void;
		setHeader(header: string, value: string): void;
		useCreadentials(useThem?: boolean): void;
		setProgressHandler(callback: (this: XMLHttpRequest, e: ProgressEvent) => any): void;
		then(callback: (value: IBaseResponse<T>) => T | PromiseLike<T>): Promise<T>;
		catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IBaseResponse<T>>;
		cancel(): void;
		send(method?: string, data?: T): void;
	}
}

export = Http;
export as namespace Http;