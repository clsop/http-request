import * as sinon from 'sinon';
import 'should';
import { describe } from "mocha";
import { suite, test } from "mocha-typescript";

import ErrorMessage from '../src/errors';
import XhrApi from '../src/request_api/xhr_api';
import FetchApi from '../src/request_api/fetch_api';
import Params from '../src/request_api/params';

describe("api tests", () => {
	@suite("xhr api tests")
	class XhrRequestTests {
		private static requests: Array<sinon.SinonFakeXMLHttpRequest>;
		private api: IRequestApi<any, any>;

		public static before() {
			XhrRequestTests.requests = [];

			global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
			global.XMLHttpRequest.onCreate = req => {
				XhrRequestTests.requests.push(req);
			}
		}

		public static after() {
			global.XMLHttpRequest.restore();
		}

		public before() {
			this.api = new XhrApi();
		}

		public after() {
			XhrRequestTests.requests = [];
		}

		@test("can construct with parameters")
		public canConstructWithParams() {
			// arrange, act
			let api = new XhrApi({ method: "POST", url: "http://fakeRequest.local", timeout: 10000 });

			// assert
			api.should.not.be.null();
		}

		@test("can construct without parameters")
		public canConstructWithoutParams() {
			// arrange, act
			let api = new XhrApi();

			// assert
			api.should.not.be.null();
			api["params"].should.not.be.null();
		}

		@test("can set method")
		public canSetMethod() {
			// arrange
			let method: Method = "PUT";

			// act
			this.api.setMethod(method);

			// assert
			this.api["params"].method.should.be.equal(method);
		}

		@test("can set header")
		public canSetHeader() {
			// arrange
			let header: { name: string, value: string } = { name: "Content-Type", value: "application/json" };

			// act
			this.api.setHeader(header.name, header.value);

			// assert
			this.api["params"].headers.should.not.be.empty();
			this.api["params"].headers.should.have.size(1);
			this.api["params"].headers.should.have.value(header.name, header.value);
		}

		@test("can set timeout")
		public canSetTimeout() {
			// arrange
			let timeout = 50000;

			// act
			this.api.setTimeout(timeout);

			// assert
			this.api["params"].timeout.should.be.equal(timeout);
		}

		@test("can set url")
		public canSetUrl() {
			// arrange
			let url = "http://fakeRequest.local";

			// act
			this.api.setUrl(url);

			// assert
			this.api["params"].url.should.be.equal(url);
		}

		@test.skip
		//@test("will timeout")
		public willTimeout(done: MochaDone) {
			// arrange
			let errorType = "timeout";
			this.api.setTimeout(500);

			// act, assert
			this.api.execute().catch((reason) => {
				// assert
				reason.should.be.equal(errorType);
				done();
			});
		}

		@test("execute without data")
		public executeWithoutData(done: MochaDone) {
			// arrange
			let status = 200;

			// act
			this.api.execute().then(() => done());
			XhrRequestTests.requests[0].respond(status, null, null);

			// assert
			this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
			this.api["xhr"].status.should.be.equal(status);
		}

		@test("execute with data")
		public executeWithData(done: MochaDone) {
			// arrange
			let status = 200;
			let data = JSON.stringify({ test: "test!" });

			// act, assert
			this.api.execute(data).then((response: any) => {
				response.responseData.should.be.equal(data);
				done();
			});
			XhrRequestTests.requests[0].respond(status, null, data);

			this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
			this.api["xhr"].status.should.be.equal(status);
		}

		@test("execute with error")
		public executeWithError(done: MochaDone) {
			// arrange
			let errorType = "error";
			let status = 0;

			// act, assert
			this.api.execute().catch((reason) => {
				reason.should.be.equal(errorType);
				done();
			});
			XhrRequestTests.requests[0].error();

			// assert
			this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
			this.api["xhr"].status.should.be.equal(status);
		}

		@test("can abort request")
		public canAbortRequest(done: MochaDone) {
			// arrange
			let errorType = "abort";
			let status = 0;
			
			// act, assert
			this.api.execute().catch((reason) => {
				reason.should.be.equal(errorType);
				done();
			});
			this.api.abort();

			// assert
			this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.UNSENT);
			this.api["xhr"].status.should.be.equal(status);
		}
	}

	@suite("fetch api tests")
	class FetchApiTests {
		private globalMock: sinon.SinonMock;
		private static abortController: { abort: () => void };
		private abortSpy: sinon.SinonSpy;
		private api: IRequestApi<any, any>;

		public static before() {
			FetchApiTests.abortController = { abort: () => {} };

			global.AbortController = () => { return FetchApiTests.abortController; };
			global.Headers = () => new Map<string, string>();
			global.fetch = (input: string | Request, init?: any) => {};
		}

		public static after() {
		}

		public before() {
			this.globalMock = sinon.mock(global);
			this.abortSpy = sinon.spy(FetchApiTests.abortController, "abort");
			this.api = new FetchApi<any, any>();
		}

		public after() {
			this.globalMock.restore();
			this.abortSpy.restore();
		}

		@test("can construct with parameters")
		public canConstructWithParams() {
			// arrange, act
			let api = new FetchApi({ method: "POST", url: "http://fakeRequest.local", timeout: 10000 });

			// assert
			api.should.not.be.null();
		}

		@test("can construct without parameters")
		public canConstructWithoutParams() {
			// arrange, act
			let api = new FetchApi();

			// assert
			api.should.not.be.null();
			api["params"].should.not.be.null();
		}

		@test("can set method")
		public canSetMethod() {
			// arrange
			let method: Method = "PUT";

			// act
			this.api.setMethod(method);

			// assert
			this.api["params"].method.should.be.equal(method);
		}

		@test("can set header")
		public canSetHeader() {
			// arrange
			let header: { name: string, value: string } = { name: "Content-Type", value: "application/json" };

			// act
			this.api.setHeader(header.name, header.value);

			// assert
			this.api["params"].headers.should.not.be.empty();
			this.api["params"].headers.should.have.size(1);
			this.api["params"].headers.should.have.value(header.name, header.value);
		}

		@test("can set timeout")
		public canSetTimeout() {
			// arrange
			let timeout = 50000;

			// act
			this.api.setTimeout(timeout);

			// assert
			this.api["params"].timeout.should.be.equal(timeout);
		}

		@test("can set url")
		public canSetUrl() {
			// arrange
			let url = "http://fakeRequest.local";

			// act
			this.api.setUrl(url);

			// assert
			this.api["params"].url.should.be.equal(url);
		}

		@test("will timeout")
		public willTimeout(done: MochaDone) {
			// arrange
			let errorType = "timeout";
			this.api.setTimeout(10);

			// act, assert
			this.api.execute().catch((reason) => {
				reason.name.should.be.equal(errorType);
				done();
			});
		}

		@test("execute without data")
		public executeWithoutData(done: MochaDone) {
			// arrange
			let responseText = "test";
			let responseData = { test: "test" };
			let response = {
				status: 200,
				statusText: "Ok",
				headers: new Headers(),
				ok: true,
				type: "basic",
				text: () => { },
				json: () => { }
			};
			let responseMock = sinon.mock(response);

			responseMock.expects("text").resolves(responseText);
			responseMock.expects("json").resolves(responseData);
			this.globalMock.expects("fetch").resolves(response);

			// act, assert
			this.api.execute().then((res) => {
				res.getStatus().should.be.equal(response.status);
				res.getStatusText().should.be.equal(response.statusText);
				res.getResponseType().should.be.equal(response.type);
				res.getResponseText().should.be.equal(responseText);
				res.getResponseData().should.be.equal(responseData);
				responseMock.verify();
				done();
			});

			// assert
			this.globalMock.verify();
		}

		@test("execute with data")
		public executeWithData(done: MochaDone) {
			// arrange
			let responseText = "test";
			let responseData = { test: "test" };
			let requestData = { test2: "test2" };
			let response = {
				status: 200,
				statusText: "Ok",
				headers: new Headers(),
				ok: true,
				type: "basic",
				text: () => { },
				json: () => { }
			};
			let responseMock = sinon.mock(response);
			responseMock.expects("text").resolves(responseText);
			responseMock.expects("json").resolves(responseData);
			this.globalMock.expects("fetch").resolves(response);

			// act, assert
			this.api.execute(requestData).then((res) => {
				res.getStatus().should.be.equal(response.status);
				res.getStatusText().should.be.equal(response.statusText);
				res.getResponseType().should.be.equal(response.type);
				res.getResponseText().should.be.equal(responseText);
				res.getResponseData().should.be.equal(responseData);
				responseMock.verify();
				done();
			});

			// assert
			this.globalMock.verify();
		}

		@test("execute with error")
		public executeWithError(done: MochaDone) {
			// arrange
			let responseText = "error";
			let responseData = { message: "error" };
			let response = {
				status: 500,
				statusText: "Error",
				headers: new Headers(),
				ok: false,
				type: "basic",
				text: () => { },
				json: () => { }
			};
			
			let responseMock = sinon.mock(response);
			responseMock.expects("text").resolves(responseText);
			responseMock.expects("json").resolves(responseData);
			this.globalMock.expects("fetch").resolves(response);

			// act, assert
			this.api.execute().catch((res) => {
				res.getStatus().should.be.equal(response.status);
				res.getStatusText().should.be.equal(response.statusText);
				res.getResponseType().should.be.equal(response.type);
				res.getResponseText().should.be.equal(responseText);
				res.getResponseData().should.be.equal(responseData);
				responseMock.verify();
				done();
			});

			// assert
			this.globalMock.verify();
		}

		@test("can abort request")
		public canAbortRequest(done: MochaDone) {
			// arrange
			let errorType = "abort";
			this.globalMock.expects("fetch").rejects(errorType);
			
			// act, assert
			this.api.execute().catch((reason) => {
				reason.name.should.be.equal(errorType);
				done();
			});
			this.api.abort();

			// assert
			this.globalMock.verify();
			this.abortSpy.calledOnce.should.be.true();
		}
	}
});