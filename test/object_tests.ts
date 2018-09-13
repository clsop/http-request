import * as sinon from 'sinon';
import 'should';
import { describe, before, after, beforeEach, afterEach } from "mocha";
import { suite, test } from "mocha-typescript";

import ErrorMessage from '../src/Errors';
import { IHttpRequest } from '../src/IHttpRequest';
import { HttpRequest } from '../src/HttpRequest';

describe("object tests", () => {
    let requests: Array<sinon.SinonFakeXMLHttpRequest> = [];
    let xhr: XMLHttpRequest;
    let req: IHttpRequest<any>;

    before(() => {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = req => {
            requests.push(req);
        }
    });

    after(() => {
        global.XMLHttpRequest.restore();
    });

    beforeEach(() => {
        req = new HttpRequest('http://fakeRequest.local');
        req.setPatience();
    });

    afterEach(() => {
        requests = [];
    });

    @suite("setPatience method")
    class SetPatience {
        @test("should use whenever eagerness when no argument")
        public defaultWhenever() {
            req.setPatience();
            req["xhr"].timeout.should.equal(0).and.be.a.Number();
        }

        @test("should be able to set eagerness")
        public setEagerness() {
            req.setPatience('NO_HURRY');
            req["xhr"].timeout.should.equal(2000).and.be.a.Number();
        }
    }

        @suite('setHeader method')
        class SetHeader {
            @test('should add one internal entry')
            public internalEntry() {
                req.setHeader('Accept', '*');
                req["headers"].should.have.property('size').equal(1);
            }

            @test('should throw exception when header is already present')
            public throwException() {
                req.setHeader('Accept', '*');
                (() => req.setHeader('Accept', 'application/json')).should.throw(ErrorMessage.HEADER_DEFINED);
            }
        }

        @suite('setUrl method')
        class SetUrl {
            @test('should throw exception when non url')
            public urlNotValid() {
                (() => req.setUrl(null)).should.throw(ErrorMessage.VALID_URL);
                (() => req.setUrl(undefined)).should.throw(ErrorMessage.VALID_URL);
                (() => req.setUrl('')).should.throw(ErrorMessage.VALID_URL);
                (() => req.setUrl('file://fakeRequest')).should.throw(ErrorMessage.VALID_URL);
                (() => req.setUrl('http://fakeRequest')).should.throw(ErrorMessage.VALID_URL);
            }

            @test('should not throw exception when valid url')
            public validUrl() {
                (() => req.setUrl('http://fakeRequest.local')).should.not.throw(ErrorMessage.VALID_URL);
            }
        }

        @suite('send method')
        class Send {
            @test('should not throw exception when valid url')
            public validUrl() {
                (() => {
                    req.setUrl('http://fakeRequest.local');
                    req.send();
                }).should.not.throw(ErrorMessage.VALID_URL);
                (() => {
                    req.setUrl('http://www.fakeRequest.com');
                    req.send();
                }).should.not.throw(ErrorMessage.VALID_URL);
                (() => {
                    req.setUrl('https://www.fakeRequest.org');
                    req.send();
                }).should.not.throw(ErrorMessage.VALID_URL);
            }

            @test('should throw exception when no url')
            public emptyUrl() {
                (() => {
                    req.setUrl(null);
                    req.send();
                }).should.throw(ErrorMessage.VALID_URL);
                (() => {
                    req.setUrl(undefined);
                    req.send();
                }).should.throw(ErrorMessage.VALID_URL);
                (() => {
                    req.setUrl('');
                    req.send();
                }).should.throw(ErrorMessage.VALID_URL);
                (() => {
                    req.setUrl('  ');
                    req.send();
                }).should.throw(ErrorMessage.VALID_URL);
            }

            @test('should throw exception when url is not valid (non url)')
            public invalidUrl() {
                (() => {
                    req.setUrl('file://fakeRequest');
                    req.send();
                }).should.throw(ErrorMessage.VALID_URL);
                (() => {
                    req.setUrl('http://fakeRequest');
                    req.send();
                }).should.throw(ErrorMessage.VALID_URL);
            }
        }
});
