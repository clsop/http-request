import HttpResponse from "../response";
import HttpFailResponse from "../fail_response";
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
        headers: new Map<string, string>(),
        timeout: 0,
      },
      params
    );
  }

  public setMethod(method: HttpRequest.Method): void {
    this.params.method = method;
  }

  public setHeader(header: string, value: string): void {
    this.params.headers.set(header, value);
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

  public async execute(data?: D): Promise<HttpRequest.IResponse<R>> {
    let promise: Promise<HttpRequest.IResponse<R>> = null;
    let headers = Object.create(null);
    let credentials: RequestCredentials = this.params.credentials
      ? "include"
      : "same-origin";

    this.params.headers.forEach((value, key) => {
      Object.defineProperty(headers, key, {
        value: value,
      });
    });

    try {
      let promises = [
        fetch(this.params.url, {
          signal: this.abortController.signal,
          method: this.params.method,
          headers: headers,
          credentials: credentials,
          body: data
            ? typeof data === "string"
              ? <string>data
              : JSON.stringify(data)
            : null,
        }),
      ];

      // TODO: use better timeout mechanism, rxjs timer ?
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

      let response: Response = await Promise.race(promises);

      const resolveData = async () => {
        let text: string = await response.text();
        let data: R = await response.json();
        let headers = new Map<string, string>();

        // TODO: not sure if this is just an object ?
        Object.getOwnPropertyNames(response.headers).forEach(name => {
          headers.set(name, (<any>response.headers)[name]);
        });

        return (
          resolve: HttpRequest.Internal.Resolve<HttpRequest.IResponse<R>>,
          reject: HttpRequest.Internal.Reject
        ) => {
          if (response.ok) {
            resolve(
              new HttpResponse<R>(
                response.status,
                response.statusText,
                headers,
                response.type,
                text,
                data
              )
            );
          } else {
            // TODO: non http or domain fail response
            reject(
              new HttpFailResponse(
                response.status,
                response.statusText,
                headers,
                response.type
              )
            );
          }
        };
      };

      return new Promise<HttpRequest.IResponse<R>>(await resolveData());
    } catch (error) {
      error = error as Error;
      
      promise = new Promise(
        (
          resolve: HttpRequest.Internal.Resolve<HttpRequest.IResponse<R>>,
          reject: HttpRequest.Internal.Reject
        ) => {
          reject(error);
        }
      );
    }

    return promise;
  }
}
