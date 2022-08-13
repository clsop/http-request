import { ResponseType } from '../response_type';
import ResponseHandler from '../response_handler';

export default class XhrApi<R, D> implements HttpRequest.Internal.IRequestApi<R, D> {
	private promise: Promise<HttpRequest.IResponse<R>>;
	private xhr: XMLHttpRequest;
    private params: HttpRequest.Internal.IParams;

	constructor(params?: HttpRequest.Internal.IParams) {
        this.params = Object.assign<HttpRequest.Internal.IParams, HttpRequest.Internal.IParams>({
            method: "GET",
            url: null,
            credentials: null,
            headers: new Map<string, string>(),
            timeout: 0
        }, params);

		let xhr = new XMLHttpRequest();
		this.promise = new Promise((resolve, reject) => {
            let failed = this.eventHook(ResponseType.Failure, reject);

            xhr.addEventListener('load', this.eventHook(ResponseType.Success, resolve));
            xhr.addEventListener('error', failed);
            xhr.addEventListener('timeout', failed);
            xhr.addEventListener('abort', failed);
        });
		this.xhr = xhr;
	}

	private eventHook = (responseType: ResponseType, resolver: HttpRequest.Internal.Resolver<HttpRequest.IResponse<R>>) => {
        return (e: Event | UIEvent | ProgressEvent) => {
            let xhr = e.target as XMLHttpRequest;
            let responseHandler = new ResponseHandler<R>(xhr);

            resolver(responseHandler.isValidResponse() ? responseHandler.getResponse(responseType) : e.type);
        };
    };

    public setMethod(method: HttpRequest.Method): void {
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

    public setCredentials(credentials: HttpRequest.Credentials): void {
        this.params.credentials = credentials;
    }

	public abort(): void {
		this.xhr.abort();
	}

	public async execute(data?: D): Promise<HttpRequest.IResponse<R>> {
        if (this.params.credentials) {
            this.xhr.open(this.params.method, this.params.url, true, this.params.credentials.username, this.params.credentials.password);
            this.xhr.withCredentials = true;
        } else {
            this.xhr.open(this.params.method, this.params.url, true);
            this.xhr.withCredentials = false;
        }

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