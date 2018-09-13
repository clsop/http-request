"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = require("./Errors");
var ResponseHandler_1 = require("./ResponseHandler");
var HttpRequestError_1 = require("./exceptions/HttpRequestError");
var HttpRequest = /** @class */ (function () {
    function HttpRequest(url, eagerness, useCredentials, username, password) {
        var _this = this;
        this.eventHook = function (promiseType, resolver) {
            return function (e) {
                var xhr = e.target;
                var responseHandler = new ResponseHandler_1.default(xhr);
                resolver(responseHandler.isValidResponse() ? responseHandler.getResponse(promiseType) : null);
            };
        };
        this.validUrl = function (url) { return /^(http|https):\/\/(?:w{3}\.)?.+(?:\.).+/.test(url); };
        var xhr = new XMLHttpRequest();
        this.url = url;
        this.useCredentials = useCredentials;
        this.username = username;
        this.password = password;
        this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);
        this.promise = new Promise(function (resolve, reject) {
            var failed = _this.eventHook(1, reject);
            xhr.addEventListener('load', _this.eventHook(0, resolve));
            xhr.addEventListener('error', failed);
            xhr.addEventListener('abort', failed);
        });
        this.headers = new Map();
        this.xhr = xhr;
        this.setPatience(eagerness);
    }
    HttpRequest.prototype.setPatience = function (eagerness) {
        if (eagerness === void 0) { eagerness = "WHENEVER"; }
        switch (eagerness) {
            case "NOW":
                this.xhr.timeout = 100;
                break;
            case "HURRY":
                this.xhr.timeout = 500;
                break;
            case "NO_HURRY":
                this.xhr.timeout = 2000;
                break;
            case "PATIENT":
                this.xhr.timeout = 10000;
                break;
            case "REAL_PATIENT":
                this.xhr.timeout = 30000;
                break;
            default:
                // whenever
                this.xhr.timeout = 0;
                break;
        }
    };
    HttpRequest.prototype.setUrl = function (url) {
        if (!this.validUrl(url)) {
            throw new HttpRequestError_1.default(Errors_1.default.VALID_URL, "The url supplied was invalid: " + url);
        }
        this.url = url;
    };
    HttpRequest.prototype.setHeader = function (header, value) {
        if (this.headers.has(header)) {
            throw new HttpRequestError_1.default(Errors_1.default.HEADER_DEFINED, "This header was already defined in the instance: " + header);
        }
        this.headers.set(header, value);
    };
    HttpRequest.prototype.useCreadentials = function (useThem) {
        if (useThem === void 0) { useThem = true; }
        this.useCredentials = useThem;
    };
    HttpRequest.prototype.setProgressHandler = function (callback) {
        this.xhr.addEventListener('progress', callback);
    };
    HttpRequest.prototype.then = function (callback) {
        return this.promise.then(callback);
    };
    HttpRequest.prototype.catch = function (callback) {
        return this.promise.catch(callback);
    };
    HttpRequest.prototype.cancel = function () {
        this.xhr.abort();
    };
    HttpRequest.prototype.send = function (method, data) {
        var _this = this;
        if (!this.validUrl(this.url)) {
            throw new HttpRequestError_1.default(Errors_1.default.VALID_URL, "The url supplied was invalid: " + this.url);
        }
        // always async
        this.xhr.open(this.methods.has(method) ? method : 'GET', this.url, true, this.username, this.password);
        this.xhr.withCredentials = this.useCredentials;
        this.headers.forEach(function (val, key) {
            _this.xhr.setRequestHeader(key, val);
        });
        if (data)
            this.xhr.send(data);
        else
            this.xhr.send();
    };
    return HttpRequest;
}());
exports.HttpRequest = HttpRequest;
