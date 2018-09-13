import { IHttpRequest, Eagerness } from './IHttpRequest';
import { IBaseResponse } from './IResponse';
export declare class HttpRequest<T> implements IHttpRequest<T> {
    private readonly headers;
    private readonly methods;
    private url;
    private useCredentials;
    private username;
    private password;
    private promise;
    private xhr;
    constructor(url: string, eagerness?: Eagerness, useCredentials?: boolean, username?: string, password?: string);
    private eventHook;
    private validUrl;
    setPatience(eagerness?: Eagerness): void;
    setUrl(url: string): void;
    setHeader(header: string, value: string): void;
    useCreadentials(useThem?: boolean): void;
    setProgressHandler(callback: (this: XMLHttpRequest, e: ProgressEvent) => any): void;
    then(callback: (value: IBaseResponse<T>) => T | PromiseLike<T>): Promise<T>;
    catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IBaseResponse<T>>;
    cancel(): void;
    send(method?: string, data?: T): void;
}
