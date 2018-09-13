import { IFailResponse } from './IResponse';
import Response from './Response';
export default class FailResponse<T> extends Response<T> implements IFailResponse<T> {
    constructor(status: number, statusText: string, responseType: string, responseText: string, responseData?: T);
    isServerError(): boolean;
    isNotFound(): boolean;
}
