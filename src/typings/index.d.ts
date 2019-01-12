/// promise stuff
type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;

type Resolver<T> = (value?: T | PromiseLike<T> | null | string) => void;

interface IParamsInternal extends Http.IParams {
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
	setMethod(method: Http.Method): void;
	setCredentials(credentials: Http.Credentials): void;
	abort(): void;
	execute(data?: D): Promise<Http.IResponse<R>>;
}