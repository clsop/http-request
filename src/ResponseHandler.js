"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response_1 = require("./Response");
var FailResponse_1 = require("./FailResponse");
/**
 * Handling data that goes onto a response
 */
var ResponseHandler = /** @class */ (function () {
    /**
     * Prepares data for Response class
     * @param  {XmlHttpRequest} xhr the XmlHttpRequest in DONE state
     * @return {void}
     */
    function ResponseHandler(xhr) {
        this.xhr = xhr;
    }
    ResponseHandler.prototype.formHeaders = function (xhr) {
        var allHeaders = xhr.getAllResponseHeaders();
        if (allHeaders !== null) {
            var headers_1 = new Map();
            var rawHeaders = allHeaders.split('\r\n');
            rawHeaders.pop(); // remove last empty entry
            rawHeaders.forEach(function (rawHeader) {
                var header = rawHeader.split(':', 2);
                headers_1.set(header[0], header[1].trim());
            });
            return headers_1;
        }
        return null;
    };
    ;
    ResponseHandler.prototype.isValidResponse = function () {
        return this.xhr.status !== 0 && this.xhr.readyState === 4;
    };
    ResponseHandler.prototype.getResponse = function (promiseType) {
        //let contentType = this.xhr.getResponseHeader('Content-Type');
        var response = null;
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
            case 0:
                response = new Response_1.default(this.xhr.status, this.xhr.statusText, this.xhr.responseType, this.xhr.responseText, this.xhr.responseType === 'document' ? this.xhr.responseXML : this.xhr.response);
                break;
            case 1:
                response = new FailResponse_1.default(this.xhr.status, this.xhr.statusText, this.xhr.responseType, this.xhr.responseText, this.xhr.responseType === 'document' ? this.xhr.responseXML : this.xhr.response);
                break;
        }
        response.setHeaders(this.formHeaders(this.xhr));
        return response;
    };
    return ResponseHandler;
}());
exports.default = ResponseHandler;
