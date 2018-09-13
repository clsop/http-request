export interface IBaseResponse<T> {
    setHeaders(headers: Map<string, string>): void;
    getHeaders(): Map<string, string>;
    getStatus(): number;
    getStatusText(): string;
    getResponseText(): string;
    getResponseType(): string;
    getResponseData(): T;
}
export interface IFailResponse<T> extends IBaseResponse<T> {
    isServerError(): boolean;
    isNotFound(): boolean;
}
