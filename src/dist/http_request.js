"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.HttpRequest = void 0;
var errors_1 = require("./errors");
var http_request_error_1 = require("./exceptions/http_request_error");
var api_error_1 = require("./exceptions/api_error");
var xhr_api_1 = require("./request_api/xhr_api");
var fetch_api_1 = require("./request_api/fetch_api");
var HttpRequest = /** @class */ (function () {
    function HttpRequest(parameters, api) {
        this.validUrl = function (url) { return /^(http|https):\/\/(?:w{3}\.)?.+(?:\.).+/.test(url); };
        var fetchApi = function () { return new fetch_api_1["default"](parameters); };
        var xhrApi = function () { return new xhr_api_1["default"](parameters); };
        switch (api) {
            case "FETCH":
                {
                    if (!("fetch" in global))
                        throw new api_error_1["default"]("fetch api is not available");
                    this.api = fetchApi();
                }
                break;
            case "XHR":
                this.api = xhrApi();
                break;
            default:
                this.api = "fetch" in global ? fetchApi() : xhrApi();
                break;
        }
        // defaults
        this.parameters = Object.assign({
            url: null,
            method: null,
            headers: new Map()
        }, parameters);
        this.setPatience(this.parameters.eagerness);
    }
    HttpRequest.prototype.setPatience = function (eagerness) {
        if (eagerness === void 0) { eagerness = "WHENEVER"; }
        switch (eagerness) {
            case "NOW":
                this.api.setTimeout(100);
                break;
            case "HURRY":
                this.api.setTimeout(500);
                break;
            case "NO_HURRY":
                this.api.setTimeout(2000);
                break;
            case "PATIENT":
                this.api.setTimeout(10000);
                break;
            case "REAL_PATIENT":
                this.api.setTimeout(30000);
                break;
            default:
                // whenever
                this.api.setTimeout(0);
                break;
        }
    };
    HttpRequest.prototype.setUrl = function (url) {
        if (!this.validUrl(url)) {
            throw new http_request_error_1["default"](errors_1["default"].VALID_URL, "The url supplied was invalid: " + url);
        }
        this.parameters.url = url;
        this.api.setUrl(url);
    };
    HttpRequest.prototype.setHeader = function (header, value) {
        if (this.parameters.headers.has(header)) {
            throw new http_request_error_1["default"](errors_1["default"].HEADER_DEFINED, "This header was already defined in the instance: " + header);
        }
        this.parameters.headers.set(header, value);
        this.api.setHeader(header, value);
    };
    HttpRequest.prototype.setCredentials = function (credentials) {
        this.api.setCredentials(credentials);
    };
    HttpRequest.prototype.abort = function () {
        this.api.abort();
    };
    HttpRequest.prototype.send = function (method, data) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.validUrl(this.parameters.url)) {
                            throw new http_request_error_1["default"](errors_1["default"].VALID_URL, "The url supplied was invalid: " + this.parameters.url);
                        }
                        // use any available method supplied (defaults to GET)
                        this.parameters.method = method ? method : (this.parameters.method ? this.parameters.method : "GET");
                        this.api.setMethod(this.parameters.method);
                        if (!(this.parameters.method === "GET" || this.parameters.method === "HEAD")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.api.execute()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.api.execute(data)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HttpRequest;
}());
exports.HttpRequest = HttpRequest;
