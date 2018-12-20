import ErrorMessage from './Errors';
import ResponseHandler from './ResponseHandler';
import HttpRequestError from './exceptions/HttpRequestError';

export class HttpRequest<T> implements IHttpRequest<T> {
    private readonly headers: Map<string, string>;
    private readonly methods: Set<string>;

    private url: string;
    private useCredentials: boolean;
    private username?: string;
    private password?: string;

    private promise: Promise<IBaseResponse<T>>;
    private xhr: XMLHttpRequest;

    constructor(url: string, eagerness?: Eagerness,
        useCredentials: boolean = false,
        username?: string, password?: string) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();

        this.url = url;
        this.useCredentials = useCredentials;
        this.username = username;
        this.password = password;
        this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);
        this.promise = new Promise((resolve, reject) => {
            let failed = this.eventHook(1, reject);

            xhr.addEventListener('load', this.eventHook(0, resolve));
            xhr.addEventListener('error', failed);
            xhr.addEventListener('abort', failed);
        });

        this.headers = new Map();
        this.xhr = xhr;
        this.setPatience(eagerness);
    }

    private eventHook = (promiseType: any, resolver: Resolver<IBaseResponse<T>>) => {
        return (e: Event) => {
            let xhr = e.target as XMLHttpRequest;
            let responseHandler = new ResponseHandler<T>(xhr);

            resolver(responseHandler.isValidResponse() ? responseHandler.getResponse(promiseType) : null);
        };
    };

    private validUrl = (url: string): boolean => /^(http|https):\/\/(?:w{3}\.)?.+(?:\.).+/.test(url);

    public setPatience(eagerness: Eagerness = "WHENEVER") {
        switch (eagerness) {
            case "NOW":
                this.xhr.timeout = 100;
                break;
            case "HURRY":
                this.xhr.timeout = 500;
                break;
            case "NO_HURRY":
                this.xhr.timeout = 2000;
                break;
            case "PATIENT":
                this.xhr.timeout = 10000;
                break;
            case "REAL_PATIENT":
                this.xhr.timeout = 30000;
                break;
            default:
                // whenever
                this.xhr.timeout = 0;
                break;
        }
    }

    public setUrl(url: string) {
        if (!this.validUrl(url)) {
            throw new HttpRequestError(ErrorMessage.VALID_URL, `The url supplied was invalid: ${url}`);
        }

        this.url = url;
    }

    public setHeader(header: string, value: string) {
        if (this.headers.has(header)) {
            throw new HttpRequestError(ErrorMessage.HEADER_DEFINED, `This header was already defined in the instance: ${header}`);
        }

        this.headers.set(header, value);
    }

    public useCreadentials(useThem: boolean = true) {
        this.useCredentials = useThem;
    }

    public setProgressHandler(callback: (this: XMLHttpRequest, e: ProgressEvent) => any) {
        this.xhr.addEventListener('progress', callback);
    }

    public then(callback: (value: IBaseResponse<T>) => T | PromiseLike<T>): Promise<T> {
        return this.promise.then<T>(callback);
    }

    public catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IBaseResponse<T>> {
        return this.promise.catch<T>(callback);
    }

    public cancel() {
        this.xhr.abort();
    }

    public send(method: string = "GET", data?: T) {
        if (!this.validUrl(this.url)) {
            throw new HttpRequestError(ErrorMessage.VALID_URL, `The url supplied was invalid: ${this.url}`);
        }

        // always async
        this.xhr.open(this.methods.has(method) ? method : 'GET', this.url, true, this.username, this.password);
        this.xhr.withCredentials = this.useCredentials;

        this.headers.forEach((val, key) => {
            this.xhr.setRequestHeader(key, val);
        });

        if (data)
            this.xhr.send(<any>data);
        else
            this.xhr.send();
    }
}