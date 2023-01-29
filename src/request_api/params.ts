export default class Params {
	public method: HttpRequest.Method;
	public url: string;
	public useCredentials: boolean;
	public timeout: number;
	public username: string;
	public password: string;
	public headers: Record<string, string>;

	constructor(url: string, method: HttpRequest.Method = "GET", useCredentials: boolean = false, timeout?: number, username?: string, password?: string) {
		this.method = method;
		this.url = url;
		this.timeout = timeout ?? 0;
		this.useCredentials = useCredentials;
		this.username = username ?? null;
		this.password = password ?? null;
		this.headers = {};
    }
}