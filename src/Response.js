"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Reponse = /** @class */ (function () {
    function Reponse(status, statusText, responseType, responseText, responseData) {
        if (responseData === void 0) { responseData = null; }
        this.status = status;
        this.statusText = statusText;
        this.responseType = responseType;
        this.responseText = responseText;
        this.responseData = responseData;
    }
    Reponse.prototype.setHeaders = function (headers) {
        this.headers = headers;
    };
    Reponse.prototype.getHeaders = function () {
        return this.headers;
    };
    Reponse.prototype.getStatus = function () {
        return this.status;
    };
    Reponse.prototype.getStatusText = function () {
        return this.statusText;
    };
    Reponse.prototype.getResponseText = function () {
        return this.responseText;
    };
    Reponse.prototype.getResponseType = function () {
        return this.responseType;
    };
    Reponse.prototype.getResponseData = function () {
        return this.responseData;
    };
    return Reponse;
}());
exports.default = Reponse;
