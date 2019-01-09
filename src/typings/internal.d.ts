/// promise stuff
type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;

interface IParams {
	method?: Method;
	url?: string;
	headers?: Map<string, string>;
	credentials?: Credentials;
}

interface IParamsInternal extends IParams {
	timeout?: number;
}

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
	setCredentials(credentials: Credentials): void;
	abort(): void;
	execute(data?: D): Promise<IResponse<R>>;
}