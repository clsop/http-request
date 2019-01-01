export default class Params implements IParams {
	public method: Method;
	public url: string;
	public useCredentials: boolean;
	public timeout: number = 0;
	public username: string = null;
	public password: string = null;
	public headers;

	constructor(url: string, method: Method = "GET", useCredentials: boolean = false, timeout?: number, username?: string, password?: string) {
		this.method = method;
		this.url = url;
		this.timeout = timeout;
		this.useCredentials = useCredentials;
		this.username = username;
		this.password = password;
		this.headers = new Map<string, string>();
    }
}