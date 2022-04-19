import * as sinon from 'sinon';
import 'should';
import { suite, test } from "@testdeck/mocha";

import FetchApi from '../src/request_api/fetch_api';
import fetchApiFixture from './setup/fetch_api_setup';

@suite("fetch api tests")
class FetchApiTests {
	private api: HttpRequest.Internal.IRequestApi<any, any>;

	public static before() {
	}

	public static after() {
	}

	public before() {
		this.api = new FetchApi();
	}

	public after() {
		fetchApiFixture.reset();
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
		let method: HttpRequest.Method = "PUT";

		// act
		this.api.setMethod(method);

		// assert
		this.api["params"].method.should.be.equal(method);
	}

	@test("can set header")
	public canSetHeader() {
		// arrange
		let header: { name: string, value: string; } = { name: "Content-Type", value: "application/json" };

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

	@test("can set credentials")
	public canSetCredentials() {
		// arrange
		let credentials = { username: "test", password: "test" };

		// act
		this.api.setCredentials(credentials);

		// assert
		this.api["params"].credentials.should.be.equal(credentials);
	}

	@test("will timeout")
	public willTimeout(done: Mocha.Done) {
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
	public executeWithoutData(done: Mocha.Done) {
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
		//fetchApiFixture.fetchSpy.resolves(response);

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
		//this.globalMock.verify();
	}

	@test("execute with data")
	public executeWithData(done: Mocha.Done) {
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
		//this.globalMock.expects("fetch").resolves(response);

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
		//this.globalMock.verify();
	}

	@test("execute with error")
	public executeWithError(done: Mocha.Done) {
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
		//this.globalMock.expects("fetch").resolves(response);

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
		//this.globalMock.verify();
	}

	@test("can abort request")
	public canAbortRequest(done: Mocha.Done) {
		// arrange
		let errorType = "abort";
		//this.globalMock.expects("fetch").rejects(errorType);

		// act, assert
		this.api.execute().catch((reason) => {
			reason.name.should.be.equal(errorType);
			done();
		});
		this.api.abort();

		// assert
		// this.globalMock.verify();
		// this.abortSpy.calledOnce.should.be.true();
	}
}