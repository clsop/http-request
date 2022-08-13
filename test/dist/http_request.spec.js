"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
require("should");
var mocha_1 = require("mocha");
var mocha_2 = require("@testdeck/mocha");
var errors_1 = require("../src/errors");
var fetch_api_1 = require("../src/request_api/fetch_api");
var xhr_api_1 = require("../src/request_api/xhr_api");
var http_request_1 = require("../src/http_request");
mocha_1.describe("http request tests", function () {
    var request;
    mocha_1.beforeEach(function () {
        request = new http_request_1.HttpRequest({ url: 'http://fakeRequest.local' });
    });
    var ApiSelection = /** @class */ (function () {
        function ApiSelection() {
        }
        ApiSelection.prototype.useFetchApi = function () {
            // act
            var request = new http_request_1.HttpRequest();
            // assert
            request["api"].should.be["instanceof"](fetch_api_1["default"]);
        };
        ApiSelection.prototype.useSelectedApi = function () {
            // arrange
            var apiSelector = "XHR";
            // act
            var request = new http_request_1.HttpRequest({}, apiSelector);
            // assert
            request["api"].should.be["instanceof"](xhr_api_1["default"]);
        };
        ApiSelection.prototype.throwWhenNotAvailable = function () {
            // arrange
            var apiSelection = "FETCH";
            delete global.fetch;
            // act
            var expectation = function () { return new http_request_1.HttpRequest({}, apiSelection); };
            // assert
            expectation.should["throw"](Error, { name: "api" });
        };
        ApiSelection.prototype.useWebWorkers = function () {
        };
        __decorate([
            mocha_2.test("should use fetch api when avalable")
        ], ApiSelection.prototype, "useFetchApi");
        __decorate([
            mocha_2.test("should use selected api")
        ], ApiSelection.prototype, "useSelectedApi");
        __decorate([
            mocha_2.test("should throw error if selected api is not available")
        ], ApiSelection.prototype, "throwWhenNotAvailable");
        __decorate([
            mocha_2.test.skip
        ], ApiSelection.prototype, "useWebWorkers");
        ApiSelection = __decorate([
            mocha_2.suite("api selection")
        ], ApiSelection);
        return ApiSelection;
    }());
    var SetPatience = /** @class */ (function () {
        function SetPatience() {
        }
        SetPatience.prototype.defaultWhenever = function () {
            // arrange
            var timeout = 0;
            // assert
            request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
        };
        SetPatience.prototype.setEagerness = function () {
            // arrange
            var eagerness = "NO_HURRY";
            var timeout = 2000;
            // act
            request.setPatience(eagerness);
            // assert
            request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
        };
        __decorate([
            mocha_2.test("should use whenever eagerness as default")
        ], SetPatience.prototype, "defaultWhenever");
        __decorate([
            mocha_2.test("should be able to set eagerness")
        ], SetPatience.prototype, "setEagerness");
        SetPatience = __decorate([
            mocha_2.suite("setPatience method")
        ], SetPatience);
        return SetPatience;
    }());
    var SetHeader = /** @class */ (function () {
        function SetHeader() {
        }
        SetHeader.prototype.headerEntry = function () {
            // arrange
            var header = { name: "Accept", value: "*" };
            // act
            request.setHeader(header.name, header.value);
            // asssert
            request["parameters"].headers.should.have.property('size').equal(1);
            // TODO: check value
        };
        SetHeader.prototype.throwException = function () {
            // arrange
            var header = { name: "Accept", value: "*" };
            // act
            request.setHeader(header.name, header.value);
            var expectation = function () { return request.setHeader(header.name, 'application/json'); };
            // assert
            expectation.should["throw"](errors_1["default"].HEADER_DEFINED);
        };
        __decorate([
            mocha_2.test('should add one header entry')
        ], SetHeader.prototype, "headerEntry");
        __decorate([
            mocha_2.test('should throw exception when header is already present')
        ], SetHeader.prototype, "throwException");
        SetHeader = __decorate([
            mocha_2.suite('setHeader method')
        ], SetHeader);
        return SetHeader;
    }());
    var SetUrl = /** @class */ (function () {
        function SetUrl() {
        }
        SetUrl.prototype.urlNotValid = function () {
            // arrange
            var expectations = [
                function () { return request.setUrl(null); },
                function () { return request.setUrl(undefined); },
                function () { return request.setUrl(''); },
                function () { return request.setUrl('file://fakeRequest'); },
                function () { return request.setUrl('http://fakeRequest'); }
            ];
            // act, assert
            expectations.forEach(function (value) {
                value.should["throw"](errors_1["default"].VALID_URL);
            });
        };
        SetUrl.prototype.validUrl = function () {
            // arrange
            var expectation = function () { return request.setUrl('http://fakeRequest.local'); };
            // act, assert
            expectation.should.not["throw"](errors_1["default"].VALID_URL);
        };
        __decorate([
            mocha_2.test('should throw exception when non url')
        ], SetUrl.prototype, "urlNotValid");
        __decorate([
            mocha_2.test('should not throw exception when valid url')
        ], SetUrl.prototype, "validUrl");
        SetUrl = __decorate([
            mocha_2.suite('setUrl method')
        ], SetUrl);
        return SetUrl;
    }());
    var SetCredentials = /** @class */ (function () {
        function SetCredentials() {
        }
        SetCredentials.prototype.setInternalCredentials = function () {
            // arrange
            var credentials = { username: "test", password: "test" };
            // act
            request.setCredentials(credentials);
            // assert
            request["api"]["params"].credentials.should.equal(credentials);
        };
        SetCredentials.prototype.setEagerness = function () {
            // arrange
            var eagerness = "NO_HURRY";
            var timeout = 2000;
            // act
            request.setPatience(eagerness);
            // assert
            request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
        };
        __decorate([
            mocha_2.test("should set internal credentials")
        ], SetCredentials.prototype, "setInternalCredentials");
        __decorate([
            mocha_2.test("should be able to set eagerness")
        ], SetCredentials.prototype, "setEagerness");
        SetCredentials = __decorate([
            mocha_2.suite("setCredentials method")
        ], SetCredentials);
        return SetCredentials;
    }());
    var Send = /** @class */ (function () {
        function Send() {
        }
        Send.prototype.validUrl = function () {
            // arrange
            var response = {
                ok: true,
                headers: new Map(),
                text: function () { },
                json: function () { }
            };
            // let responseMock = sinon.mock(response);
            // responseMock.expects("text").resolves("");
            // responseMock.expects("json").resolves({});
            // windowMock.expects("fetch").resolves(response);
            var expectations = [function () {
                    request.setUrl('http://fakeRequest.local');
                    request.send();
                }, function () {
                    request.setUrl('http://www.fakeRequest.com');
                    request.send();
                }, function () {
                    request.setUrl('https://www.fakeRequest.org');
                    request.send();
                }];
            // act, assert
            expectations.forEach(function (value) { return value.should.not["throw"](errors_1["default"].VALID_URL); });
            //responseMock.verify();
            //globalMock.verify();
        };
        Send.prototype.emptyUrl = function () {
            // arrange
            var expectations = [function () {
                    request.setUrl(null);
                    request.send();
                }, function () {
                    request.setUrl(undefined);
                    request.send();
                }, function () {
                    request.setUrl('');
                    request.send();
                }, function () {
                    request.setUrl('  ');
                    request.send();
                }];
            // act, assert
            expectations.forEach(function (value) { return value.should["throw"](errors_1["default"].VALID_URL); });
        };
        Send.prototype.invalidUrl = function () {
            // arrange
            var expectations = [function () {
                    request.setUrl('file://fakeRequest');
                    request.send();
                }, function () {
                    request.setUrl('http://fakeRequest');
                    request.send();
                }];
            // act, assert
            expectations.forEach(function (value) { return value.should["throw"](errors_1["default"].VALID_URL); });
        };
        __decorate([
            mocha_2.test('should not throw exception when valid url')
        ], Send.prototype, "validUrl");
        __decorate([
            mocha_2.test('should throw exception when no url')
        ], Send.prototype, "emptyUrl");
        __decorate([
            mocha_2.test('should throw exception when url is not valid (non url)')
        ], Send.prototype, "invalidUrl");
        Send = __decorate([
            mocha_2.suite('send method')
        ], Send);
        return Send;
    }());
});
