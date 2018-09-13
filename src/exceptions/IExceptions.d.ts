declare namespace Http {
    interface IHttpRequestError extends Error {
        toString(): string;
    }
    interface IHttpResponseError extends IHttpRequestError {
        getResponseType(): string;
    }
}
