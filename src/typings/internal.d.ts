/// promise stuff
type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;

interface IParams {
	method: string;
	url: string;
	useCredentials?: boolean;
	timeout?: number;
	headers?: Map<string, string>;
	username?: string;
	password?: string;
}