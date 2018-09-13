"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError_1 = require("./HttpError");
var HttpResponseError = /** @class */ (function (_super) {
    __extends(HttpResponseError, _super);
    function HttpResponseError(message, info, ResponseType) {
        var _this = _super.call(this, 'HttpResponseError', message, info) || this;
        _this.ResponseType = ResponseType;
        return _this;
    }
    HttpResponseError.prototype.getResponseType = function () {
        return this.ResponseType;
    };
    return HttpResponseError;
}(HttpError_1.default));
exports.default = HttpResponseError;
