import * as sinon from 'sinon';
import 'should';
import { suite, test } from "mocha-typescript";

import { HttpRequest } from '../src/http_request';

@suite("fail request tests")
class RequestFailTests {
    private static requests: Array<sinon.SinonFakeXMLHttpRequest> = [];
    private req: IHttpRequest<any>;

    static before() {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = req => {
            RequestFailTests.requests.push(req);
        };
    }

    static after() {
        global.XMLHttpRequest.restore();
    }

    public before() {
        this.req = new HttpRequest('http://fakeRequest.local');
    }

    public after() {
        RequestFailTests.requests = [];
    }

    @test("should be able to cancel a pending request")
    public shouldBeAbleToCancel(done: () => void) {
        let callback = sinon.spy();

        this.req.catch(callback);
        this.req.send();
        this.req.cancel();

        setTimeout(() => {
            callback.calledWith(null).should.be.true();
            done();
        }, 0);
    }
}