import SuccessResponse from "../succes_response";
import FailureResponse from "../failure_response";
import TimeoutError from "../exceptions/timeout_error";

export default class FetchApi<R, D>
  implements HttpRequest.Internal.IRequestApi<R, D>
{
  private abortController: AbortController;
  private params: HttpRequest.Internal.IParams;

  constructor(params?: HttpRequest.Internal.IParams) {
    this.abortController = new AbortController();
    this.params = Object.assign<
      HttpRequest.Internal.IParams,
      HttpRequest.Internal.IParams
    >(
      {
        method: "GET",
        url: null,
        credentials: null,
        headers: Object.create(null),
        timeout: 0,
      },
      params
    );
  }

  private async resolveData(httpResponse: Response): Promise<HttpRequest.IResponse<R>> {
    let headers: Record<string, string> = {};
    let text: string = null;
    let data: R = null;

    // TODO: not sure if this is just an object ?
    httpResponse.headers.forEach((value, header) => (headers[header] = value));

    try {
      text = await httpResponse.text();
      data = await httpResponse.json();
    } catch (error) {
      // either text or data is empty and we dont care ?
    }

    let response: HttpRequest.IResponse<R> = null;

    if (httpResponse.ok) {
      response = new SuccessResponse<R>(
        httpResponse.status,
        httpResponse.statusText,
        headers,
        httpResponse.type,
        text,
        data
      );
    } else {
      response = new FailureResponse(
        httpResponse.status,
        httpResponse.statusText,
        headers,
        httpResponse.type,
        text
      )
    }

    return response;
  }

  public setMethod(method: HttpRequest.Method): void {
    this.params.method = method;
  }

  public setTimeout(timeout: number): void {
    this.params.timeout = timeout;
  }

  public setUrl(url: string): void {
    this.params.url = url;
  }

  public setCredentials(credentials: HttpRequest.Credentials): void {
    this.params.credentials = credentials;
  }

  public abort(): void {
    this.abortController.abort();
  }

  public async execute(
    data?: D,
    additionalHeaders?: Record<string, string>
  ): Promise<HttpRequest.IResponse<R>> {
    let credentials: RequestCredentials = this.params.credentials
      ? "include"
      : "same-origin";

    // overrides param headers
    let headers = Object.assign<Record<string, string>, Record<string, string>>(
      Object.create(null),
      this.params.headers
    );
    headers = Object.assign(headers, additionalHeaders);

    let fetchOptions: RequestInit = {
      signal: this.abortController.signal,
      method: this.params.method,
      headers: headers,
      credentials: credentials,
    };

    if (data) {
      fetchOptions["body"] =
        typeof data === "string" ? <string>data : JSON.stringify(data);
    }

    let promises = [fetch(this.params.url, fetchOptions)];

    if (this.params.timeout > 0) {
      promises.push(
        new Promise<Response>((resolve, reject) => {
          setTimeout(
            () => reject(new TimeoutError("the request timed out")),
            this.params.timeout
          );
        })
      );
    }

    const httpResponse: Response = await Promise.race(promises);
    const response = await this.resolveData(httpResponse);

    return new Promise<HttpRequest.IResponse<R>>((resolve, reject) => {
      if (response instanceof FailureResponse) {
        reject(response);
      } else {
        resolve(response);
      }
    });
  }
}
