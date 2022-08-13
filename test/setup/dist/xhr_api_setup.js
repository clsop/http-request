"use strict";
exports.__esModule = true;
var sinon = require("sinon");
var xmlHttpRequests = new Array();
// TODO: fix typing for fake xhr setup
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
global.XMLHttpRequest.onCreate = function (xhr) {
    xmlHttpRequests.push(xhr);
};
var reset = function () {
    xmlHttpRequests.splice(0, xmlHttpRequests.length);
};
exports["default"] = {
    reset: reset,
    xmlHttpRequests: xmlHttpRequests
};
