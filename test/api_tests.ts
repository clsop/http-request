import * as sinon from 'sinon';
import 'should';
import { describe } from "mocha";
import { suite, test } from "mocha-typescript";

import ErrorMessage from '../src/errors';
import XhrRequestApi from '../src/request_api/xhr_api';
import Params from '../src/request_api/params';

describe("api tests", () => {
    @suite("xhr api tests")
    class XhrRequestTests {
    	private static requests: Array<sinon.SinonFakeXMLHttpRequest>;
    	private api: XhrRequestApi<any>;

    	public static before() {
	        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
	        global.XMLHttpRequest.onCreate = req => {
	            this.requests.push(req);
	        }
    	}

	    public static after() {
	        global.XMLHttpRequest.restore();
	    }

    	public before() {
	        this.api = new XhrRequestApi(new Params('http://fakeRequest.local'));
    	}

    	public after() {
        	XhrRequestTests.requests = [];
    	}

        @test("should be able to recieve json response content")
	    public async shouldBeAbleToRecieve() {
	        let res: IBaseResponse<any> = await this.api.execute();
	        
	        JSON.stringify(res.getResponseType()).should.not.be.null()
	         ((res) => {
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
    }
});