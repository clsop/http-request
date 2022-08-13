import ErrorMessage from './errors';
import ResponseHandler from './response_handler';
import HttpRequestError from './exceptions/http_request_error';

import ApiError from './exceptions/api_error';
import XhrApi from './request_api/xhr_api';
import FetchApi from './request_api/fetch_api';

export class HttpRequest<R, D> {
    private readonly api: HttpRequest.Internal.IRequestApi<R, D>;
    private readonly parameters: HttpRequest.IParameters;

    constructor(parameters?: HttpRequest.IParameters, api?: HttpRequest.Api) {
        let fetchApi = (): HttpRequest.Internal.IRequestApi<R, D> => new FetchApi(parameters);
        let xhrApi = (): HttpRequest.Internal.IRequestApi<R, D> => new XhrApi(parameters);

        switch (api) {
            case "FETCH": {
                if (!("fetch" in global)) throw new ApiError("fetch api is not available");
                this.api = fetchApi();
            } break;
            case "XHR": this.api = xhrApi(); break;
            default: this.api = "fetch" in global ? fetchApi() : xhrApi(); break;
        }

        // defaults
        this.parameters = Object.assign<HttpRequest.IParameters, HttpRequest.IParameters>({
            url: null,
            method: null,
            headers: new Map<string, string>()
        }, parameters);
        this.setPatience(this.parameters.eagerness);
    }

    private validUrl = (url: string): boolean => /^(http|https):\/\/(?:w{3}\.)?.+(?:\.).+/.test(url);

    public setPatience(eagerness: HttpRequest.Eagerness = "WHENEVER") {

        switch (eagerness) {
            case "NOW":
                this.api.setTimeout(100);
                break;
            case "HURRY":
                this.api.setTimeout(500);
                break;
            case "NO_HURRY":
                this.api.setTimeout(2000);
                break;
            case "PATIENT":
                this.api.setTimeout(10000);
                break;
            case "REAL_PATIENT":
                this.api.setTimeout(30000);
                break;
            default:
                // whenever
                this.api.setTimeout(0);
                break;
        }
    }

    public setUrl(url: string) {
        if (!this.validUrl(url)) {
            throw new HttpRequestError(ErrorMessage.VALID_URL, `The url supplied was invalid: ${url}`);
        }

        this.parameters.url = url;
        this.api.setUrl(url);
    }

    public setHeader(header: string, value: string) {
        if (this.parameters.headers.has(header)) {
            throw new HttpRequestError(ErrorMessage.HEADER_DEFINED, `This header was already defined in the instance: ${header}`);
        }

        this.parameters.headers.set(header, value);
        this.api.setHeader(header, value);
    }

    public setCredentials(credentials: HttpRequest.Credentials) {
        this.api.setCredentials(credentials);
    }

    public abort() {
        this.api.abort();
    }

    public async send(method?: HttpRequest.Method, data?: D): Promise<HttpRequest.IResponse<R>> {
        if (!this.validUrl(this.parameters.url)) {
            throw new HttpRequestError(ErrorMessage.VALID_URL, `The url supplied was invalid: ${this.parameters.url}`);
        }

        // use any available method supplied (defaults to GET)
        this.parameters.method = method ? method : (this.parameters.method ? this.parameters.method : "GET");
        this.api.setMethod(this.parameters.method);

        // GET and HEAD cannot contain data
        if (this.parameters.method === "GET" || this.parameters.method === "HEAD") {
            return await this.api.execute();
        }

        return await this.api.execute(data);
    }
}