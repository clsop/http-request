export default class SuccessReponse<T> implements HttpRequest.IResponse<T> {
  private _status: number;
  private _statusText: string;
  private _headers: Record<string, string>;
  private _responseType: string;
  private _responseText: string;
  private _responseData?: T;

  constructor(
    status: number,
    statusText: string,
    headers: Record<string, string>,
    responseType: string,
    responseText: string,
    responseData?: T
  ) {
    this._status = status;
    this._statusText = statusText;
    this._headers = headers;
    this._responseType = responseType;
    this._responseText = responseText;
    this._responseData = responseData;
  }

  public get headers(): Record<string, string> {
    return this._headers;
  }

  public get status(): number {
    return this._status;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public get responseText(): string {
    return this._responseText;
  }

  public get responseType(): string {
    return this._responseType;
  }

  public get responseData(): T {
    return this._responseData;
  }
}
