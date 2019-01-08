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