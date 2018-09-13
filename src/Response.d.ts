import { IBaseResponse } from './IResponse';
export default class Reponse<T> implements IBaseResponse<T> {
    private status;
    private statusText;
    private responseType;
    private responseText;
    private responseData;
    private headers;
    constructor(status: number, statusText: string, responseType: string, responseText: string, responseData?: T);
    setHeaders(headers: Map<string, string>): void;
    getHeaders(): Map<string, string>;
    getStatus(): number;
    getStatusText(): string;
    getResponseText(): string;
    getResponseType(): string;
    getResponseData(): T;
}
