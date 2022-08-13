"use strict";
exports.__esModule = true;
var sinon = require("sinon");
global.fetch = function (input, init) { return new Promise(function (res, rej) { }); };
var fetchSpy = sinon.spy(global, "fetch");
var abortSpy = sinon.spy(global.AbortController.prototype, "abort");
var reset = function () {
    abortSpy.resetHistory();
    fetchSpy.resetHistory();
};
exports["default"] = {
    reset: reset,
    abortSpy: abortSpy,
    fetchSpy: fetchSpy
};
