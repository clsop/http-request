import SuccessReponse from "./succes_response";

export default class FailureResponse
  extends SuccessReponse<never>
  implements HttpRequest.IFailureResponse
{
  constructor(
    status: number,
    statusText: string,
    headers: Record<string, string>,
    responseType: string,
    responseText: string
  ) {
    super(status, statusText, headers, responseType, responseText);
  }

  public get isUnauthorized(): boolean {
    return this.status === 401;
  }

  public get isForbidden(): boolean {
    return this.status === 403;
  }

  public get isServerError(): boolean {
    return this.status === 500;
  }

  public get isNotFound(): boolean {
    return this.status === 404;
  }
}
