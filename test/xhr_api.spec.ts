import 'should';
import { suite, test } from "@testdeck/mocha";

import XhrApi from '../src/request_api/xhr_api';
import xhrApiFixture from './setup/xhr_api_setup';

@suite("xhr api tests")
class XhrRequestTests {
	private api: HttpRequest.Internal.IRequestApi<any, any>;

	public static before() {
	}

	public static after() {
		//global.XMLHttpRequest.restore();
	}

	public before() {
		this.api = new XhrApi();
	}

	public after() {
		xhrApiFixture.reset();
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

	@test.skip
	//@test("will timeout")
	public willTimeout(done: Mocha.Done) {
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
	public executeWithoutData(done: Mocha.Done) {
		// arrange
		let status = 200;

		// act
		this.api.execute().then(() => done());
		xhrApiFixture.xmlHttpRequests[0].respond(status, null, null);

		// assert
		this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
		this.api["xhr"].status.should.be.equal(status);
	}

	@test("execute with data")
	public executeWithData(done: Mocha.Done) {
		// arrange
		let status = 200;
		let data = JSON.stringify({ test: "test!" });

		// act, assert
		this.api.execute(data).then((response: any) => {
			response.responseData.should.be.equal(data);
			done();
		});
		xhrApiFixture.xmlHttpRequests[0].respond(status, null, data);

		this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
		this.api["xhr"].status.should.be.equal(status);
	}

	@test("execute with error")
	public executeWithError(done: Mocha.Done) {
		// arrange
		let errorType = "error";
		let status = 0;

		// act, assert
		this.api.execute().catch((reason) => {
			reason.should.be.equal(errorType);
			done();
		});
		xhrApiFixture.xmlHttpRequests[0].error();

		// assert
		this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
		this.api["xhr"].status.should.be.equal(status);
	}

	@test("can abort request")
	public canAbortRequest(done: Mocha.Done) {
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