import ErrorMessage from './Errors';
import Response from './Response';
import FailResponse from './FailResponse';
import HttpResponseError from './exceptions/HttpResponseError';

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

    private formHeaders(xhr: XMLHttpRequest): Map<string, string> {
        let allHeaders = xhr.getAllResponseHeaders();

        if (allHeaders !== null) {
            let headers = new Map<string, string>();
            let rawHeaders = allHeaders.split('\r\n');
            rawHeaders.pop(); // remove last empty entry

            rawHeaders.forEach((rawHeader) => {
                let header = rawHeader.split(':', 2);
                headers.set(header[0], header[1].trim());
            });

            return headers;
        }

        return null;
    };

    public isValidResponse(): boolean {
        return this.xhr.status !== 0 && this.xhr.readyState === 4;
    }

    public getResponse(promiseType: number): Response<T> {
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

        switch (promiseType) {
        	case 0: response = new Response<T>(this.xhr.status, this.xhr.statusText, this.xhr.responseType, this.xhr.responseText,
                    this.xhr.responseType === 'document' ? this.xhr.responseXML : this.xhr.response); break;
        	case 1: response = new FailResponse<T>(this.xhr.status, this.xhr.statusText, this.xhr.responseType, this.xhr.responseText,
                    this.xhr.responseType === 'document' ? this.xhr.responseXML : this.xhr.response); break;
        }

        response.setHeaders(this.formHeaders(this.xhr));
        return response;
    }
}