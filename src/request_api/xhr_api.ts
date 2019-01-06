import { ResponseType } from '../response_type';
import ResponseHandler from '../response_handler';

export default class XhrApi<R, D> implements IRequestApi<R, D> {
	private params: IParams;
	private promise: Promise<IResponse<R>>;
	private xhr: XMLHttpRequest;

	constructor(params: IParams = { method: "GET", url: null, useCredentials: false, headers: new Map<string, string>(), timeout: 0 }) {
		let xhr = new XMLHttpRequest();

		this.params = params;
		this.promise = new Promise((resolve, reject) => {
            let failed = this.eventHook(ResponseType.Failure, reject);

            //xhr.ontimeout = failed;
            xhr.addEventListener('load', this.eventHook(0, resolve));
            xhr.addEventListener('error', failed);
            xhr.addEventListener('ontimeout', failed);
            xhr.addEventListener('abort', failed);
        });
		this.xhr = xhr;
	}

	private eventHook = (responseType: ResponseType, resolver: Resolver<IResponse<R>>) => {
        return (e: Event | UIEvent | ProgressEvent) => {
            let xhr = e.target as XMLHttpRequest;
            let responseHandler = new ResponseHandler<R>(xhr);

            resolver(responseHandler.isValidResponse() ? responseHandler.getResponse(responseType) : e.type);
        };
    };

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
		this.xhr.abort();
	}

	public async execute(data?: D): Promise<IResponse<R>> {
		this.xhr.open(this.params.method, this.params.url, true, this.params.username, this.params.password);
        this.xhr.withCredentials = this.params.useCredentials;
        this.xhr.timeout = this.params.timeout;

        this.params.headers.forEach((val, key) => {
            this.xhr.setRequestHeader(key, val);
        });

        if (data) {
        	this.xhr.send(JSON.stringify(data));
        } else {
        	this.xhr.send();
        }

		return await this.promise;
	}
}