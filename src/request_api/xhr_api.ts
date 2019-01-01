import { ResponseType } from '../response_type';
import ResponseHandler from '../response_handler';

export default class XhrRequestApi<T> implements IRequestApi<T> {
	private params: IParams;
	private promise: Promise<IBaseResponse<T>>;
	private xhr: XMLHttpRequest;

	constructor(params: IParams) {
		let xhr = new XMLHttpRequest();

		this.params = params;
		this.promise = new Promise((resolve, reject) => {
            let failed = this.eventHook(ResponseType.Failure, reject);

            xhr.addEventListener('load', this.eventHook(0, resolve));
            xhr.addEventListener('error', failed);
            xhr.addEventListener('abort', failed);
        });
		this.xhr = xhr;
	}

	private eventHook = (responseType: ResponseType, resolver: Resolver<IBaseResponse<T>>) => {
        return (e: Event) => {
            let xhr = e.target as XMLHttpRequest;
            let responseHandler = new ResponseHandler<T>(xhr);

            resolver(responseHandler.isValidResponse() ? responseHandler.getResponse(responseType) : null);
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

	public async execute(data?: Data): Promise<IBaseResponse<T>> {
		this.xhr.open(this.params.method, this.params.url, true, this.params.username, this.params.password);
        this.xhr.withCredentials = this.params.useCredentials;

        this.params.headers.forEach((val, key) => {
            this.xhr.setRequestHeader(key, val);
        });

        if (data) {
        	this.xhr.send(data);
        } else {
        	this.xhr.send();
        }

		return await this.promise;
	}
}