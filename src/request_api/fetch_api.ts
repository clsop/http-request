import HttpResponse from '../response';
import HttpFailResponse from '../fail_response';
import TimeoutError from '../exceptions/timeout_error';

export default class FetchApi<R, D> implements IRequestApi<R, D> {
	private abortController: AbortController;
	private params: IParams;

	constructor(params: IParams = { method: "GET", url: null, useCredentials: false, headers: new Map<string, string>(), timeout: 0 }) {
		this.params = params;
		this.abortController = new AbortController();
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
		this.abortController.abort();
	}

	public async execute(data?: D): Promise<IResponse<R>> {
		let promise: Promise<IResponse<R>> = null;
		let headers = Object.create(null);

		this.params.headers.forEach((value, key) => {
			Object.defineProperty(headers, key, {
				value: value
			});
		});

		try {
			let promises = [await fetch(this.params.url, {
				signal: this.abortController.signal,
				method: this.params.method,
				headers: headers,
				body: data && typeof data === "string" ? <string>data : JSON.stringify(data)
			})];

			if (this.params.timeout > 0) {
				promises.push(await new Promise<any>((resolve, reject) => {
					setTimeout(() => reject(new TimeoutError("the request timed out")), this.params.timeout);
				}));
			}

			let response: Response = await Promise.race(promises);
			promise = new Promise<IResponse<R>>(async (resolve: Resolve<IResponse<R>>, reject: Reject) => {
				let text: string = await response.text();
				let data: R = await response.json();
				let headers = new Map<string, string>();

				response.headers.forEach((value, key) => {
					headers.set(key, value);
				});

				if (response.ok) {
					resolve(new HttpResponse<R>(response.status, response.statusText, headers, response.type, text, data));
				} else {
					reject(new HttpFailResponse<R>(response.status, response.statusText, headers, response.type, text, data));
				}
			});
		} catch (ex) {
			promise = new Promise((resolve: Resolve<IResponse<R>>, reject: Reject) => {
				reject(ex);
			});
		}

		return promise;
	}
}