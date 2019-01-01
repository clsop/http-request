export default class FetchApi<T> implements IRequestApi<T> {
	private params: IParams;

	constructor(params: IParams) {
		this.params = params;
	}

    public setMethod(method: Method): void {
    	this.params.method = method;
    }

    public setHeader(header: string, value: string): void {
    	this.params.headers.set(header, value);
    }

	public setTimeout(timeout: number): void {
		this.params.timeout = timeout;
	}

	public setUrl(url: string): void {
		this.params.url = url;
	}

	public abort(): void {
	}

	public async execute(data?: Data): Promise<IBaseResponse<T>> {
		return null;
	}
}