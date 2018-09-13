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
var mocha_1 = require("mocha");
var mocha_typescript_1 = require("mocha-typescript");
var Errors_1 = require("../src/Errors");
var HttpRequest_1 = require("../src/HttpRequest");
mocha_1.describe("object tests", function () {
    var requests = [];
    var xhr;
    var req;
    mocha_1.before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = function (req) {
            requests.push(req);
        };
    });
    mocha_1.after(function () {
        global.XMLHttpRequest.restore();
    });
    mocha_1.beforeEach(function () {
        req = new HttpRequest_1.HttpRequest('http://fakeRequest.local');
        req.setPatience();
    });
    mocha_1.afterEach(function () {
        requests = [];
    });
    var SetPatience = /** @class */ (function () {
        function SetPatience() {
        }
        SetPatience.prototype.defaultWhenever = function () {
            req.setPatience();
            req["xhr"].timeout.should.equal(0).and.be.a.Number();
        };
        SetPatience.prototype.setEagerness = function () {
            req.setPatience('NO_HURRY');
            req["xhr"].timeout.should.equal(2000).and.be.a.Number();
        };
        __decorate([
            mocha_typescript_1.test("should use whenever eagerness when no argument")
        ], SetPatience.prototype, "defaultWhenever", null);
        __decorate([
            mocha_typescript_1.test("should be able to set eagerness")
        ], SetPatience.prototype, "setEagerness", null);
        SetPatience = __decorate([
            mocha_typescript_1.suite("setPatience method")
        ], SetPatience);
        return SetPatience;
    }());
    var SetHeader = /** @class */ (function () {
        function SetHeader() {
        }
        SetHeader.prototype.internalEntry = function () {
            req.setHeader('Accept', '*');
            req["headers"].should.have.property('size').equal(1);
        };
        SetHeader.prototype.throwException = function () {
            req.setHeader('Accept', '*');
            (function () { return req.setHeader('Accept', 'application/json'); }).should.throw(Errors_1.default.HEADER_DEFINED);
        };
        __decorate([
            mocha_typescript_1.test('should add one internal entry')
        ], SetHeader.prototype, "internalEntry", null);
        __decorate([
            mocha_typescript_1.test('should throw exception when header is already present')
        ], SetHeader.prototype, "throwException", null);
        SetHeader = __decorate([
            mocha_typescript_1.suite('setHeader method')
        ], SetHeader);
        return SetHeader;
    }());
    var SetUrl = /** @class */ (function () {
        function SetUrl() {
        }
        SetUrl.prototype.urlNotValid = function () {
            (function () { return req.setUrl(null); }).should.throw(Errors_1.default.VALID_URL);
            (function () { return req.setUrl(undefined); }).should.throw(Errors_1.default.VALID_URL);
            (function () { return req.setUrl(''); }).should.throw(Errors_1.default.VALID_URL);
            (function () { return req.setUrl('file://fakeRequest'); }).should.throw(Errors_1.default.VALID_URL);
            (function () { return req.setUrl('http://fakeRequest'); }).should.throw(Errors_1.default.VALID_URL);
        };
        SetUrl.prototype.validUrl = function () {
            (function () { return req.setUrl('http://fakeRequest.local'); }).should.not.throw(Errors_1.default.VALID_URL);
        };
        __decorate([
            mocha_typescript_1.test('should throw exception when non url')
        ], SetUrl.prototype, "urlNotValid", null);
        __decorate([
            mocha_typescript_1.test('should not throw exception when valid url')
        ], SetUrl.prototype, "validUrl", null);
        SetUrl = __decorate([
            mocha_typescript_1.suite('setUrl method')
        ], SetUrl);
        return SetUrl;
    }());
    var Send = /** @class */ (function () {
        function Send() {
        }
        Send.prototype.validUrl = function () {
            (function () {
                req.setUrl('http://fakeRequest.local');
                req.send();
            }).should.not.throw(Errors_1.default.VALID_URL);
            (function () {
                req.setUrl('http://www.fakeRequest.com');
                req.send();
            }).should.not.throw(Errors_1.default.VALID_URL);
            (function () {
                req.setUrl('https://www.fakeRequest.org');
                req.send();
            }).should.not.throw(Errors_1.default.VALID_URL);
        };
        Send.prototype.emptyUrl = function () {
            (function () {
                req.setUrl(null);
                req.send();
            }).should.throw(Errors_1.default.VALID_URL);
            (function () {
                req.setUrl(undefined);
                req.send();
            }).should.throw(Errors_1.default.VALID_URL);
            (function () {
                req.setUrl('');
                req.send();
            }).should.throw(Errors_1.default.VALID_URL);
            (function () {
                req.setUrl('  ');
                req.send();
            }).should.throw(Errors_1.default.VALID_URL);
        };
        Send.prototype.invalidUrl = function () {
            (function () {
                req.setUrl('file://fakeRequest');
                req.send();
            }).should.throw(Errors_1.default.VALID_URL);
            (function () {
                req.setUrl('http://fakeRequest');
                req.send();
            }).should.throw(Errors_1.default.VALID_URL);
        };
        __decorate([
            mocha_typescript_1.test('should not throw exception when valid url')
        ], Send.prototype, "validUrl", null);
        __decorate([
            mocha_typescript_1.test('should throw exception when no url')
        ], Send.prototype, "emptyUrl", null);
        __decorate([
            mocha_typescript_1.test('should throw exception when url is not valid (non url)')
        ], Send.prototype, "invalidUrl", null);
        Send = __decorate([
            mocha_typescript_1.suite('send method')
        ], Send);
        return Send;
    }());
});
