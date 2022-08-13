"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
require("should");
var mocha_1 = require("@testdeck/mocha");
var xhr_api_1 = require("../src/request_api/xhr_api");
var xhr_api_setup_1 = require("./setup/xhr_api_setup");
var XhrRequestTests = /** @class */ (function () {
    function XhrRequestTests() {
    }
    XhrRequestTests.before = function () {
    };
    XhrRequestTests.after = function () {
        //global.XMLHttpRequest.restore();
    };
    XhrRequestTests.prototype.before = function () {
        this.api = new xhr_api_1["default"]();
    };
    XhrRequestTests.prototype.after = function () {
        xhr_api_setup_1["default"].reset();
    };
    XhrRequestTests.prototype.canConstructWithParams = function () {
        // arrange, act
        var api = new xhr_api_1["default"]({ method: "POST", url: "http://fakeRequest.local", timeout: 10000 });
        // assert
        api.should.not.be["null"]();
    };
    XhrRequestTests.prototype.canConstructWithoutParams = function () {
        // arrange, act
        var api = new xhr_api_1["default"]();
        // assert
        api.should.not.be["null"]();
        api["params"].should.not.be["null"]();
    };
    XhrRequestTests.prototype.canSetMethod = function () {
        // arrange
        var method = "PUT";
        // act
        this.api.setMethod(method);
        // assert
        this.api["params"].method.should.be.equal(method);
    };
    XhrRequestTests.prototype.canSetHeader = function () {
        // arrange
        var header = { name: "Content-Type", value: "application/json" };
        // act
        this.api.setHeader(header.name, header.value);
        // assert
        this.api["params"].headers.should.not.be.empty();
        this.api["params"].headers.should.have.size(1);
        this.api["params"].headers.should.have.value(header.name, header.value);
    };
    XhrRequestTests.prototype.canSetTimeout = function () {
        // arrange
        var timeout = 50000;
        // act
        this.api.setTimeout(timeout);
        // assert
        this.api["params"].timeout.should.be.equal(timeout);
    };
    XhrRequestTests.prototype.canSetUrl = function () {
        // arrange
        var url = "http://fakeRequest.local";
        // act
        this.api.setUrl(url);
        // assert
        this.api["params"].url.should.be.equal(url);
    };
    XhrRequestTests.prototype.canSetCredentials = function () {
        // arrange
        var credentials = { username: "test", password: "test" };
        // act
        this.api.setCredentials(credentials);
        // assert
        this.api["params"].credentials.should.be.equal(credentials);
    };
    XhrRequestTests.prototype.willTimeout = function (done) {
        // arrange
        var errorType = "timeout";
        this.api.setTimeout(500);
        // act, assert
        this.api.execute()["catch"](function (reason) {
            // assert
            reason.should.be.equal(errorType);
            done();
        });
    };
    XhrRequestTests.prototype.executeWithoutData = function (done) {
        // arrange
        var status = 200;
        // act
        this.api.execute().then(function () { return done(); });
        xhr_api_setup_1["default"].xmlHttpRequests[0].respond(status, null, null);
        // assert
        this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
        this.api["xhr"].status.should.be.equal(status);
    };
    XhrRequestTests.prototype.executeWithData = function (done) {
        // arrange
        var status = 200;
        var data = JSON.stringify({ test: "test!" });
        // act, assert
        this.api.execute(data).then(function (response) {
            response.responseData.should.be.equal(data);
            done();
        });
        xhr_api_setup_1["default"].xmlHttpRequests[0].respond(status, null, data);
        this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
        this.api["xhr"].status.should.be.equal(status);
    };
    XhrRequestTests.prototype.executeWithError = function (done) {
        // arrange
        var errorType = "error";
        var status = 0;
        // act, assert
        this.api.execute()["catch"](function (reason) {
            reason.should.be.equal(errorType);
            done();
        });
        xhr_api_setup_1["default"].xmlHttpRequests[0].error();
        // assert
        this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
        this.api["xhr"].status.should.be.equal(status);
    };
    XhrRequestTests.prototype.canAbortRequest = function (done) {
        // arrange
        var errorType = "abort";
        var status = 0;
        // act, assert
        this.api.execute()["catch"](function (reason) {
            reason.should.be.equal(errorType);
            done();
        });
        this.api.abort();
        // assert
        this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.UNSENT);
        this.api["xhr"].status.should.be.equal(status);
    };
    __decorate([
        mocha_1.test("can construct with parameters")
    ], XhrRequestTests.prototype, "canConstructWithParams");
    __decorate([
        mocha_1.test("can construct without parameters")
    ], XhrRequestTests.prototype, "canConstructWithoutParams");
    __decorate([
        mocha_1.test("can set method")
    ], XhrRequestTests.prototype, "canSetMethod");
    __decorate([
        mocha_1.test("can set header")
    ], XhrRequestTests.prototype, "canSetHeader");
    __decorate([
        mocha_1.test("can set timeout")
    ], XhrRequestTests.prototype, "canSetTimeout");
    __decorate([
        mocha_1.test("can set url")
    ], XhrRequestTests.prototype, "canSetUrl");
    __decorate([
        mocha_1.test("can set credentials")
    ], XhrRequestTests.prototype, "canSetCredentials");
    __decorate([
        mocha_1.test.skip
    ], XhrRequestTests.prototype, "willTimeout");
    __decorate([
        mocha_1.test("execute without data")
    ], XhrRequestTests.prototype, "executeWithoutData");
    __decorate([
        mocha_1.test("execute with data")
    ], XhrRequestTests.prototype, "executeWithData");
    __decorate([
        mocha_1.test("execute with error")
    ], XhrRequestTests.prototype, "executeWithError");
    __decorate([
        mocha_1.test("can abort request")
    ], XhrRequestTests.prototype, "canAbortRequest");
    XhrRequestTests = __decorate([
        mocha_1.suite("xhr api tests")
    ], XhrRequestTests);
    return XhrRequestTests;
}());
