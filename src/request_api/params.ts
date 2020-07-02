export default class Params {
	public method: HttpRequest.Method;
	public url: string;
	public useCredentials: boolean;
	public timeout: number = 0;
	public username: string = null;
	public password: string = null;
	public headers: Map<string, string>;

	constructor(url: string, method: HttpRequest.Method = "GET", useCredentials: boolean = false, timeout?: number, username?: string, password?: string) {
		this.method = method;
		this.url = url;
		this.timeout = timeout;
		this.useCredentials = useCredentials;
		this.username = username;
		this.password = password;
		this.headers = new Map<string, string>();
    }
}