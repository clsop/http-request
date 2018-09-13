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
var RequestSuccessTest = /** @class */ (function () {
    function RequestSuccessTest() {
    }
    RequestSuccessTest_1 = RequestSuccessTest;
    RequestSuccessTest.before = function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = function (req) {
            RequestSuccessTest_1.requests.push(req);
        };
    };
    RequestSuccessTest.after = function () {
        global.XMLHttpRequest.restore();
    };
    RequestSuccessTest.prototype.before = function () {
        this.req = new HttpRequest_1.HttpRequest('http://fakeRequest.local');
    };
    RequestSuccessTest.prototype.after = function () {
        RequestSuccessTest_1.requests = [];
    };
    RequestSuccessTest.prototype.shouldBeAbleToRecieve = function (done) {
        this.req.then(function (res) {
            (function () {
                JSON.stringify(res.getResponseType()).should.not.be.null();
            }).should.not.throw();
            done();
        });
        this.req.send();
        //RequestSuccessTest.requests[0].responseType = 'json';
        RequestSuccessTest_1.requests[0].respond(200, {
            'Content-Type': 'application/json'
        }, '{ "test": "test" }');
    };
    RequestSuccessTest.requests = [];
    __decorate([
        mocha_typescript_1.test("should be able to recieve json response content")
    ], RequestSuccessTest.prototype, "shouldBeAbleToRecieve", null);
    RequestSuccessTest = RequestSuccessTest_1 = __decorate([
        mocha_typescript_1.suite("success request tests")
    ], RequestSuccessTest);
    return RequestSuccessTest;
    var RequestSuccessTest_1;
}());
