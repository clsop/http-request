import * as sinon from 'sinon';
import 'should';
import { suite, test, skip } from "mocha-typescript";

import { HttpRequest } from '../src/http_request';

@suite("success request tests")
class RequestSuccessTest {
    private static requests: Array<sinon.SinonFakeXMLHttpRequest> = [];
    private req: IHttpRequest<any>;

    static before() {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = req => {
            RequestSuccessTest.requests.push(req);
        };
    }

    static after() {
        global.XMLHttpRequest.restore();
    }

    public before() {
        this.req = new HttpRequest<any>('http://fakeRequest.local');
    }

    public after() {
        RequestSuccessTest.requests = [];
    }

    @test("should be able to recieve json response content")
    public shouldBeAbleToRecieve(done: () => void) {
        this.req.then((res) => {
            (() => {
                JSON.stringify(res.getResponseType()).should.not.be.null();
            }).should.not.throw();
            done();
        });
        this.req.send();

        //RequestSuccessTest.requests[0].responseType = 'json';
        RequestSuccessTest.requests[0].respond(200, {
            'Content-Type': 'application/json'
        }, '{ "test": "test" }');
    }

    @test.skip
    //@test("should use Content-Type to determine response type")
    public shouldUseContentType() { }
}