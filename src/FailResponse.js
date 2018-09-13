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
var Response_1 = require("./Response");
var FailResponse = /** @class */ (function (_super) {
    __extends(FailResponse, _super);
    function FailResponse(status, statusText, responseType, responseText, responseData) {
        if (responseData === void 0) { responseData = null; }
        return _super.call(this, status, statusText, responseType, responseText, responseData) || this;
    }
    FailResponse.prototype.isServerError = function () {
        return this.getStatus() === 500;
    };
    FailResponse.prototype.isNotFound = function () {
        return this.getStatus() === 404;
    };
    return FailResponse;
}(Response_1.default));
exports.default = FailResponse;
