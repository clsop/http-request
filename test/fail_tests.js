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
var RequestFailTests = /** @class */ (function () {
    function RequestFailTests() {
    }
    RequestFailTests_1 = RequestFailTests;
    RequestFailTests.before = function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = function (req) {
            RequestFailTests_1.requests.push(req);
        };
    };
    RequestFailTests.after = function () {
        global.XMLHttpRequest.restore();
    };
    RequestFailTests.prototype.before = function () {
        this.req = new HttpRequest_1.HttpRequest('http://fakeRequest.local');
    };
    RequestFailTests.prototype.after = function () {
        RequestFailTests_1.requests = [];
    };
    RequestFailTests.prototype.shouldBeAbleToCancel = function (done) {
        var callback = sinon.spy();
        this.req.catch(callback);
        this.req.send();
        this.req.cancel();
        setTimeout(function () {
            callback.calledWith(null).should.be.true();
            done();
        }, 0);
    };
    RequestFailTests.requests = [];
    __decorate([
        mocha_typescript_1.test("should be able to cancel a pending request")
    ], RequestFailTests.prototype, "shouldBeAbleToCancel", null);
    RequestFailTests = RequestFailTests_1 = __decorate([
        mocha_typescript_1.suite("fail request tests")
    ], RequestFailTests);
    return RequestFailTests;
    var RequestFailTests_1;
}());
