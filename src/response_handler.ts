import Response from "./succes_response";
import FailureResponse from "./failure_response";
import { ResponseType } from "./response_type";

/**
 * Handling data that goes onto a response
 */
export default class ResponseHandler<T> {
  private xhr: XMLHttpRequest;

  /**
   * Prepares data for Response class
   * @param  {XmlHttpRequest} xhr the XmlHttpRequest in DONE state
   * @return {void}
   */
  constructor(xhr: XMLHttpRequest) {
    this.xhr = xhr;
  }

  private formHeaders(allHeaders: string): Record<string, string> {
    if (allHeaders !== null) {
      let headers: Record<string, string> = Object.create(null);
      let rawHeaders = allHeaders.split("\r\n");
      rawHeaders.pop(); // remove last empty entry

      rawHeaders.forEach((rawHeader) => {
        let header = rawHeader.split(":", 2);
        headers[header[0]] = header[1].trim();
      });

      return headers;
    }

    return Object.create(null);
  }

  public isValidResponse(): boolean {
    return this.xhr.status !== 0 && this.xhr.readyState === 4;
  }

  public getResponse(responseType: ResponseType): Response<T> {
    /// TODO: content handling
    //let contentType = this.xhr.getResponseHeader('Content-Type');
    let response = null;

    // switch (contentType) {
    //     case 'text/plain':
    //         this.xhr.responseType = 'text';
    //         break;
    //     case 'text/html':
    //     case 'text/xml':
    //     case 'application/xml':
    //         this.xhr.responseType = 'document';
    //         break;
    //     case 'application/json':
    //         this.xhr.responseType = 'json';
    //         break;
    // }

    switch (responseType) {
      case ResponseType.Success:
        response = new Response<T>(
          this.xhr.status,
          this.xhr.statusText,
          this.formHeaders(this.xhr.getAllResponseHeaders()),
          this.xhr.responseType,
          this.xhr.responseText,
          this.xhr.responseType === "document"
            ? this.xhr.responseXML
            : this.xhr.response
        );
        break;
      case ResponseType.Failure:
        response = new FailureResponse(
          this.xhr.status,
          this.xhr.statusText,
          this.formHeaders(this.xhr.getAllResponseHeaders()),
          this.xhr.responseType,
          this.xhr.responseText
        );
        break;
    }

    return response;
  }
}
