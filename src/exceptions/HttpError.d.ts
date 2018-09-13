export default class HttpError extends Error {
    protected info: string;
    constructor(name: string, message: string, info: string);
    toString: () => string;
}
