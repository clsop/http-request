import * as sinon from 'sinon';
import 'should';
import { describe, before, after, beforeEach, afterEach } from "mocha";
import { suite, test } from "mocha-typescript";

import ErrorMessage from '../src/errors';
import FetchApi from '../src/request_api/fetch_api';
import XhrApi from '../src/request_api/xhr_api';
import { HttpRequest } from '../src/http_request';

describe("http request tests", () => {
    let request: Http.IHttpRequest<any, any>;
    let globalMock: sinon.SinonMock;
    let windowMock: sinon.SinonMock;

    beforeEach(() => {
        // fake and mock fetch api
        let window = Object.create(null, {
            fetch: {
                value: (input: string | Request, init?: any) => new Promise((resolve, reject) => {}),
                configurable: true
            }
        });
        global.fetch = (input: string | Request, init?: any) => new Promise((resolve, reject) => { });
        global.window = window;

        let abortController = { abort: () => { } };
        global.AbortController = () => { return abortController; };
        windowMock = sinon.mock(global.window);
        globalMock = sinon.mock(global);

        request = new HttpRequest({ url: 'http://fakeRequest.local' });
    });

    afterEach(() => {
        globalMock.restore();
        windowMock.restore();
    });

    @suite("api selection")
    class ApiSelection {
        @test("should use fetch api when avalable")
        public useFetchApi() {
            // act
            let request = new HttpRequest();

            // assert
            request["api"].should.be.instanceof(FetchApi);
        }

        @test("should use selected api")
        public useSelectedApi() {
            // arrange
            let apiSelector: Http.Api = "XHR";

            // act
            let request = new HttpRequest({}, apiSelector);

            // assert
            request["api"].should.be.instanceof(XhrApi);
        }

        @test("should throw error if selected api is not available")
        public throwWhenNotAvailable() {
            // arrange
            let apiSelection: Http.Api = "FETCH";

            globalMock.restore();
            windowMock.restore();
            global.window = Object.create(null);

            // act
            let expectation = () => new HttpRequest({}, apiSelection);

            // assert
            expectation.should.throw(Error, { name: "api" });
        }

        @test.skip
        //@test("should use web workers if available")
        public useWebWorkers() {
        }
    }

    @suite("setPatience method")
    class SetPatience {
        @test("should use whenever eagerness as default")
        public defaultWhenever() {
            // arrange
            let timeout = 0;

            // assert
            request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
        }

        @test("should be able to set eagerness")
        public setEagerness() {
            // arrange
            let eagerness: Http.Eagerness = "NO_HURRY";
            let timeout = 2000;

            // act
            request.setPatience(eagerness);

            // assert
            request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
        }
    }

    @suite('setHeader method')
    class SetHeader {
        @test('should add one header entry')
        public headerEntry() {
            // arrange
            let header = { name: "Accept", value: "*" };

            // act
            request.setHeader(header.name, header.value);

            // asssert
            request["parameters"].headers.should.have.property('size').equal(1);
            // TODO: check value
        }

        @test('should throw exception when header is already present')
        public throwException() {
            // arrange
            let header = { name: "Accept", value: "*" };

            // act
            request.setHeader(header.name, header.value);
            let expectation = () => request.setHeader(header.name, 'application/json');

            // assert
            expectation.should.throw(ErrorMessage.HEADER_DEFINED);
        }
    }

    @suite('setUrl method')
    class SetUrl {
        @test('should throw exception when non url')
        public urlNotValid() {
            // arrange
            let expectations = [
                () => request.setUrl(null),
                () => request.setUrl(undefined),
                () => request.setUrl(''),
                () => request.setUrl('file://fakeRequest'),
                () => request.setUrl('http://fakeRequest')
            ];

            // act, assert
            expectations.forEach((value) => {
                value.should.throw(ErrorMessage.VALID_URL);
            });
        }

        @test('should not throw exception when valid url')
        public validUrl() {
            // arrange
            let expectation = () => request.setUrl('http://fakeRequest.local');

            // act, assert
            expectation.should.not.throw(ErrorMessage.VALID_URL);
        }
    }

    @suite("setCredentials method")
    class SetCredentials {
        @test("should set internal credentials")
        public setInternalCredentials() {
            // arrange
            let credentials = { username: "test", password: "test" };

            // act
            request.setCredentials(credentials);

            // assert
            request["api"]["params"].credentials.should.equal(credentials);
        }

        @test("should be able to set eagerness")
        public setEagerness() {
            // arrange
            let eagerness: Http.Eagerness = "NO_HURRY";
            let timeout = 2000;

            // act
            request.setPatience(eagerness);

            // assert
            request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
        }
    }

    @suite('send method')
    class Send {
        @test('should not throw exception when valid url')
        public validUrl() {
            // arrange
            let response = {
                ok: true,
                headers: new Map<string, string>(),
                text: () => { },
                json: () => { }
            };
            let responseMock = sinon.mock(response);
            responseMock.expects("text").resolves("");
            responseMock.expects("json").resolves({});
            windowMock.expects("fetch").resolves(response);

            let expectations = [() => {
                request.setUrl('http://fakeRequest.local');
                request.send();
            }, () => {
                request.setUrl('http://www.fakeRequest.com');
                request.send();
            }, () => {
                request.setUrl('https://www.fakeRequest.org');
                request.send();
            }];

            // act, assert
            expectations.forEach((value) => value.should.not.throw(ErrorMessage.VALID_URL));
            //responseMock.verify();
            //globalMock.verify();
        }

        @test('should throw exception when no url')
        public emptyUrl() {
            // arrange
            let expectations = [() => {
                request.setUrl(null);
                request.send();
            }, () => {
                request.setUrl(undefined);
                request.send();
            }, () => {
                request.setUrl('');
                request.send();
            }, () => {
                request.setUrl('  ');
                request.send();
            }];

            // act, assert
            expectations.forEach((value) => value.should.throw(ErrorMessage.VALID_URL));
        }

        @test('should throw exception when url is not valid (non url)')
        public invalidUrl() {
            // arrange
            let expectations = [() => {
                request.setUrl('file://fakeRequest');
                request.send();
            }, () => {
                request.setUrl('http://fakeRequest');
                request.send();
            }];

            // act, assert
            expectations.forEach((value) => value.should.throw(ErrorMessage.VALID_URL));
        }
    }
});
