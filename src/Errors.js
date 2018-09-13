"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Errors = /** @class */ (function () {
    function Errors() {
    }
    Errors.VALID_URL = 'must be a valid url';
    Errors.HEADER_DEFINED = 'header is already defined';
    Errors.FUNCTION_MISSING_PARAM = 'argument must be a function with one parameter';
    Errors.FUNCTION_CALLBACK = 'callback must be a function';
    return Errors;
}());
exports.default = Errors;
