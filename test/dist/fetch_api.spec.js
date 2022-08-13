"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var sinon = require("sinon");
require("should");
var mocha_1 = require("@testdeck/mocha");
var fetch_api_1 = require("../src/request_api/fetch_api");
var fetch_api_setup_1 = require("./setup/fetch_api_setup");
var FetchApiTests = /** @class */ (function () {
    function FetchApiTests() {
    }
    FetchApiTests.prototype.before = function () {
        this.api = new fetch_api_1["default"]();
    };
    FetchApiTests.prototype.after = function () {
        fetch_api_setup_1["default"].reset();
    };
    FetchApiTests.prototype.canConstructWithParams = function () {
        // arrange, act
        var api = new fetch_api_1["default"]({ method: "POST", url: "http://fakeRequest.local", timeout: 10000 });
        // assert
        api.should.not.be["null"]();
    };
    FetchApiTests.prototype.canConstructWithoutParams = function () {
        // arrange, act
        var api = new fetch_api_1["default"]();
        // assert
        api.should.not.be["null"]();
        api["params"].should.not.be["null"]();
    };
    FetchApiTests.prototype.canSetMethod = function () {
        // arrange
        var method = "PUT";
        // act
        this.api.setMethod(method);
        // assert
        this.api["params"].method.should.be.equal(method);
    };
    FetchApiTests.prototype.canSetHeader = function () {
        // arrange
        var header = { name: "Content-Type", value: "application/json" };
        // act
        this.api.setHeader(header.name, header.value);
        // assert
        this.api["params"].headers.should.not.be.empty();
        this.api["params"].headers.should.have.size(1);
        this.api["params"].headers.should.have.value(header.name, header.value);
    };
    FetchApiTests.prototype.canSetTimeout = function () {
        // arrange
        var timeout = 50000;
        // act
        this.api.setTimeout(timeout);
        // assert
        this.api["params"].timeout.should.be.equal(timeout);
    };
    FetchApiTests.prototype.canSetUrl = function () {
        // arrange
        var url = "http://fakeRequest.local";
        // act
        this.api.setUrl(url);
        // assert
        this.api["params"].url.should.be.equal(url);
    };
    FetchApiTests.prototype.canSetCredentials = function () {
        // arrange
        var credentials = { username: "test", password: "test" };
        // act
        this.api.setCredentials(credentials);
        // assert
        this.api["params"].credentials.should.be.equal(credentials);
    };
    FetchApiTests.prototype.willTimeout = function (done) {
        // arrange
        var errorType = "timeout";
        this.api.setTimeout(10);
        // act, assert
        this.api.execute()["catch"](function (reason) {
            reason.name.should.be.equal(errorType);
            done();
        });
    };
    FetchApiTests.prototype.executeWithoutData = function (done) {
        // arrange
        var responseText = "test";
        var responseData = { test: "test" };
        var response = {
            status: 200,
            statusText: "Ok",
            headers: new Headers(),
            ok: true,
            type: "basic",
            text: function () { },
            json: function () { }
        };
        var responseMock = sinon.mock(response);
        responseMock.expects("text").resolves(responseText);
        responseMock.expects("json").resolves(responseData);
        //fetchApiFixture.fetchSpy.resolves(response);
        // act, assert
        this.api.execute().then(function (res) {
            res.getStatus().should.be.equal(response.status);
            res.getStatusText().should.be.equal(response.statusText);
            res.getResponseType().should.be.equal(response.type);
            res.getResponseText().should.be.equal(responseText);
            res.getResponseData().should.be.equal(responseData);
            responseMock.verify();
            done();
        });
        // assert
        //this.globalMock.verify();
    };
    FetchApiTests.prototype.executeWithData = function (done) {
        // arrange
        var responseText = "test";
        var responseData = { test: "test" };
        var requestData = { test2: "test2" };
        var response = {
            status: 200,
            statusText: "Ok",
            headers: new Headers(),
            ok: true,
            type: "basic",
            text: function () { },
            json: function () { }
        };
        var responseMock = sinon.mock(response);
        responseMock.expects("text").resolves(responseText);
        responseMock.expects("json").resolves(responseData);
        //this.globalMock.expects("fetch").resolves(response);
        // act, assert
        this.api.execute(requestData).then(function (res) {
            res.getStatus().should.be.equal(response.status);
            res.getStatusText().should.be.equal(response.statusText);
            res.getResponseType().should.be.equal(response.type);
            res.getResponseText().should.be.equal(responseText);
            res.getResponseData().should.be.equal(responseData);
            responseMock.verify();
            done();
        });
        // assert
        //this.globalMock.verify();
    };
    FetchApiTests.prototype.executeWithError = function (done) {
        // arrange
        var responseText = "error";
        var responseData = { message: "error" };
        var response = {
            status: 500,
            statusText: "Error",
            headers: new Headers(),
            ok: false,
            type: "basic",
            text: function () { },
            json: function () { }
        };
        var responseMock = sinon.mock(response);
        responseMock.expects("text").resolves(responseText);
        responseMock.expects("json").resolves(responseData);
        //this.globalMock.expects("fetch").resolves(response);
        // act, assert
        this.api.execute()["catch"](function (res) {
            res.getStatus().should.be.equal(response.status);
            res.getStatusText().should.be.equal(response.statusText);
            res.getResponseType().should.be.equal(response.type);
            res.getResponseText().should.be.equal(responseText);
            res.getResponseData().should.be.equal(responseData);
            responseMock.verify();
            done();
        });
        // assert
        //this.globalMock.verify();
    };
    FetchApiTests.prototype.canAbortRequest = function (done) {
        // arrange
        var errorType = "abort";
        //this.globalMock.expects("fetch").rejects(errorType);
        // act, assert
        this.api.execute()["catch"](function (reason) {
            reason.name.should.be.equal(errorType);
            done();
        });
        this.api.abort();
        // assert
        // this.globalMock.verify();
        // this.abortSpy.calledOnce.should.be.true();
    };
    __decorate([
        mocha_1.test("can construct with parameters")
    ], FetchApiTests.prototype, "canConstructWithParams");
    __decorate([
        mocha_1.test("can construct without parameters")
    ], FetchApiTests.prototype, "canConstructWithoutParams");
    __decorate([
        mocha_1.test("can set method")
    ], FetchApiTests.prototype, "canSetMethod");
    __decorate([
        mocha_1.test("can set header")
    ], FetchApiTests.prototype, "canSetHeader");
    __decorate([
        mocha_1.test("can set timeout")
    ], FetchApiTests.prototype, "canSetTimeout");
    __decorate([
        mocha_1.test("can set url")
    ], FetchApiTests.prototype, "canSetUrl");
    __decorate([
        mocha_1.test("can set credentials")
    ], FetchApiTests.prototype, "canSetCredentials");
    __decorate([
        mocha_1.test("will timeout")
    ], FetchApiTests.prototype, "willTimeout");
    __decorate([
        mocha_1.test("execute without data")
    ], FetchApiTests.prototype, "executeWithoutData");
    __decorate([
        mocha_1.test("execute with data")
    ], FetchApiTests.prototype, "executeWithData");
    __decorate([
        mocha_1.test("execute with error")
    ], FetchApiTests.prototype, "executeWithError");
    __decorate([
        mocha_1.test("can abort request")
    ], FetchApiTests.prototype, "canAbortRequest");
    FetchApiTests = __decorate([
        mocha_1.suite("fetch api tests")
    ], FetchApiTests);
    return FetchApiTests;
}());
