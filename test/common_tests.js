"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sinon = require("sinon");
require("should");
var mocha_typescript_1 = require("mocha-typescript");
var HttpRequest_1 = require("../src/HttpRequest");
var RequestTests = /** @class */ (function () {
    function RequestTests() {
    }
    RequestTests_1 = RequestTests;
    RequestTests.before = function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = function (req) {
            RequestTests_1.requests.push(req);
        };
    };
    RequestTests.after = function () {
        global.XMLHttpRequest.restore();
    };
    RequestTests.prototype.before = function () {
        this.req = new HttpRequest_1.HttpRequest('http://fakeRequest.local');
    };
    RequestTests.prototype.after = function () {
        RequestTests_1.requests = [];
    };
    RequestTests.prototype.getRequest = function () {
        this.req.send();
        RequestTests_1.requests[0].method.should.equal('GET');
    };
    RequestTests.prototype.recieveRequest = function (done) {
        var callback = sinon.spy();
        this.req.then(callback);
        this.req.send();
        RequestTests_1.requests[0].respond(200, null, null);
        setTimeout(function () {
            callback.calledOnce.should.be.true();
            done();
        }, 0);
    };
    RequestTests.prototype.canRecieveStatus = function (done) {
        this.req.then(function (res) {
            res.getStatus().should.equal(302);
            done();
        });
        this.req.send();
        RequestTests_1.requests[0].respond(302, null, null);
    };
    RequestTests.prototype.canFormHeaders = function (done) {
        this.req.then(function (res) {
            res.getHeaders().should.be.an.instanceof(Map)
                .and.have.property('size').and.equal(2);
            done();
        });
        this.req.send();
        RequestTests_1.requests[0].respond(200, {
            'Content-Type': 'text/plain',
            'Content-Length': 10
        }, 'hello test');
    };
    RequestTests.prototype.nullResponseParam = function (done) {
        var callback = sinon.spy();
        // emulate error before sending
        this.req["xhr"].addEventListener('loadstart', function (e) { return e.target.error(); });
        this.req.catch(callback);
        this.req.send();
        setTimeout(function () {
            callback.calledWith(null).should.be.true();
            done();
        }, 0);
    };
    RequestTests.requests = [];
    __decorate([
        mocha_typescript_1.test("should send a GET request as default")
    ], RequestTests.prototype, "getRequest", null);
    __decorate([
        mocha_typescript_1.test("should be able to recieve a response")
    ], RequestTests.prototype, "recieveRequest", null);
    __decorate([
        mocha_typescript_1.test("should be able to recieve a specific status code")
    ], RequestTests.prototype, "canRecieveStatus", null);
    __decorate([
        mocha_typescript_1.test("should form response headers into map collection")
    ], RequestTests.prototype, "canFormHeaders", null);
    __decorate([
        mocha_typescript_1.test("should recieve null in callback response parameter if request fails before sending")
    ], RequestTests.prototype, "nullResponseParam", null);
    RequestTests = RequestTests_1 = __decorate([
        mocha_typescript_1.suite("common request tests")
    ], RequestTests);
    return RequestTests;
    var RequestTests_1;
}());
