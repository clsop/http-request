import * as sinon from 'sinon';
import 'should';
import { suite, test } from "mocha-typescript";

import { HttpRequest } from '../src/HttpRequest';
import Response from '../src/Response';

@suite("common request tests")
class RequestTests {
    private static requests: Array<sinon.SinonFakeXMLHttpRequest> = [];
    private req: IHttpRequest<any>;

    static before() {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = (req: sinon.SinonFakeXMLHttpRequest) => {
            RequestTests.requests.push(req);
        };
    }

    static after() {
        global.XMLHttpRequest.restore();
    }

    public before() {
        this.req = new HttpRequest('http://fakeRequest.local');
    }

    public after() {
        RequestTests.requests = [];
    }

    @test("should send a GET request as default")
    public getRequest() {
        this.req.send();
        RequestTests.requests[0].method.should.equal('GET');
    }

    @test("should be able to recieve a response")
    public recieveRequest(done: () => void) {
        let callback = sinon.spy();

        this.req.then(callback);
        this.req.send();

        RequestTests.requests[0].respond(200, null, null);

        setTimeout(() => {
            callback.calledOnce.should.be.true();
            done();
        }, 0);
    }

    @test("should be able to recieve a specific status code")
    public canRecieveStatus(done: () => void) {
        this.req.then((res) => {
            res.getStatus().should.equal(302);
            done();
        });
        this.req.send();

        RequestTests.requests[0].respond(302, null, null);
    }

    @test("should form response headers into map collection")
    public canFormHeaders(done: () => void) {
        this.req.then((res) => {
            res.getHeaders().should.be.an.instanceof(Map)
                .and.have.property('size').and.equal(2)
            done();
        });
        this.req.send();

        RequestTests.requests[0].respond(200, {
            'Content-Type': 'text/plain',
            'Content-Length': 10
        }, 'hello test');
    }

    @test("should recieve null in callback response parameter if request fails before sending")
    public nullResponseParam(done: () => void) {
        let callback = sinon.spy();

        // emulate error before sending
        this.req["xhr"].addEventListener('loadstart', (e) => (<any>e.target).error());

        this.req.catch(callback);
        this.req.send();

        setTimeout(() => {
            callback.calledWith(null).should.be.true();
            done();
        }, 0);
    }
}