import * as sinon from "sinon";
import "should";
import { suite, test } from "@testdeck/mocha";

import FetchApi from "../src/request_api/fetch_api";
import SuccessResponse from "../src/succes_response";
import FailureResponse from "../src/failure_response";
import fetchApiFixture from "./setup/fetch_api_setup";
import HttpResponseError from "../src/exceptions/http_response_error";

@suite("fetch api tests")
class FetchApiTests {
  private url: string;
  private api: any;

  public before() {
    this.url = "http://test.local";
    this.api = new FetchApi({ url: this.url });
  }

  public after() {
    fetchApiFixture.reset();
  }

  @test("can construct with parameters")
  public canConstructWithParams() {
    // arrange, act
    let api = new FetchApi({
      method: "POST",
      url: "http://fakeRequest.local",
      timeout: 10000,
    });

    // assert
    api.should.not.be.null();
  }

  @test("can construct without parameters")
  public canConstructWithoutParams() {
    // arrange, act
    let api: any = new FetchApi();

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
  public async willTimeout() {
    // arrange
    const timeout = 5;
    const errorType = "timeout";
    this.api.setTimeout(timeout);

    // reset callthough, we fake it for timing out logic
    fetchApiFixture.fetchSpy.reset();

    // make fetch longer running than timeout
    const lrPromise = new Promise((res, rej) => {
      setTimeout(() => res({}), timeout + timeout);
    });
    fetchApiFixture.fetchSpy.returns(lrPromise);

    // act
    try {
      await this.api.execute();
    } catch (error) {
      // assert
      error.name.should.be.equal(errorType);
    }
  }

  @test("execute without data")
  public async executeWithoutData() {
    // arrange
    let responseText = "test";
    let responseData = { test: "test" };
    let response: Response = new Response(null, {
      status: 200,
      statusText: "Ok",
      headers: new Headers(),
    });

    let responseMock = sinon.mock(response);
    responseMock.expects("text").resolves(responseText);
    responseMock.expects("json").resolves(responseData);

    fetchApiFixture.fetchSpy.resolves(response);

    // act
    const result: SuccessResponse<typeof responseData> =
      await this.api.execute();

    // assert
    result.getStatus().should.be.equal(response.status);
    result.getStatusText().should.be.equal(response.statusText);
    result.getResponseText().should.be.equal(responseText);
    result.getResponseData().should.be.equal(responseData);

    responseMock.verify();
  }

  @test("execute with data")
  public async executeWithData() {
    // arrange
    let responseText = "test";
    let responseData = { test: "test" };
    let requestData = { test2: "test2" };
    let response = new Response(null, {
      status: 200,
      statusText: "Ok",
      headers: new Headers(),
    });

    let responseMock = sinon.mock(response);
    responseMock.expects("text").resolves(responseText);
    responseMock.expects("json").resolves(responseData);

    fetchApiFixture.fetchSpy.resolves(response);

    // act
    const result = await this.api.execute(requestData);

    // assert
    result.getStatus().should.be.equal(response.status);
    result.getStatusText().should.be.equal(response.statusText);
    result.getResponseText().should.be.equal(responseText);
    result.getResponseData().should.be.equal(responseData);

    fetchApiFixture.fetchSpy
      .calledWithMatch(this.url, { body: JSON.stringify(requestData) })
      .should.be.True();
    responseMock.verify();
  }

  @test("set param headers when no additional headers")
  public async setParamHeaders() {
    // arrange
    const headers = {
      header1: "value 1",
      header2: "value 2",
    };
    this.api["params"].headers = headers;

    const response = new Response(null, {
      status: 200,
    });
    fetchApiFixture.fetchSpy.resolves(response);

    // act
    await this.api.execute();

    // assert
    fetchApiFixture.fetchSpy
      .calledWithMatch(this.url, {
        headers: headers,
      })
      .should.be.True();
  }

  @test("override param headers with additional headers")
  public async overrideHeaders() {
    // arrange
    const additionalRequestHeaders = {
      header2: "value 3",
    };
    const baseHeaders = {
      header1: "value 1",
      header2: "value 2",
    };
    const expectedHeaders = {
      header1: "value 1",
      header2: "value 3",
    };
    this.api["params"].headers = baseHeaders;

    const response = new Response(null, {
      status: 200,
    });
    fetchApiFixture.fetchSpy.resolves(response);

    // act
    await this.api.execute(null, additionalRequestHeaders);

    // assert
    fetchApiFixture.fetchSpy
      .calledWithMatch(this.url, {
        headers: expectedHeaders,
      })
      .should.be.True();
  }

  @test("param headers with additional headers")
  public async additionalHeaders() {
    // arrange
    const additionalRequestHeaders = {
      header3: "value 3",
    };
    const baseHeaders = {
      header1: "value 1",
      header2: "value 2",
    };
    const expectedHeaders = {
      header1: "value 1",
      header2: "value 2",
      header3: "value 3",
    };
    this.api["params"].headers = baseHeaders;

    const response = new Response(null, {
      status: 200,
    });
    fetchApiFixture.fetchSpy.resolves(response);

    // act
    await this.api.execute(null, additionalRequestHeaders);

    // assert
    fetchApiFixture.fetchSpy
      .calledWithMatch(this.url, {
        headers: expectedHeaders,
      })
      .should.be.True();
  }

  @test("execute with server error")
  public async executeWithError() {
    // arrange
    let errorObj: Error = {
      name: "Server Error",
      message: "Error",
    };

    fetchApiFixture.fetchSpy.rejects(errorObj);

    // act
    try {
      await this.api.execute();
    } catch (error) {
      const errorResult = error as Error;

      // assert
      errorResult.name.should.be.equal(errorObj.name);
      errorResult.message.should.be.equal(errorObj.message);
    }
  }

  @test("response other than succes response")
  public async executeWithNonOk() {
    // arrange
    let response = new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });

    fetchApiFixture.fetchSpy.resolves(response);

    // act
    try {
      await this.api.execute();
    } catch (error) {
      const failureResponse = error as HttpRequest.IFailureResponse;

      // assert
      failureResponse.isServerError().should.be.False();
      failureResponse.isNotFound().should.be.False();
      failureResponse.isForbidden().should.be.False();
      failureResponse.isUnauthorized().should.be.True();
    }
  }

  @test("can abort request")
  public async canAbortRequest() {
    // arrange
    let errorType = "AbortError";

    // timing seems to interfere here, so we reset the spy and enable callthrough again
    fetchApiFixture.fetchSpy.reset();
    fetchApiFixture.fetchSpy.callThrough();

    // act
    try {
      await Promise.all([
        this.api.execute(),
        new Promise((resolve: any, reject: any) => {
          this.api.abort();
          resolve();
        }),
      ]);
    } catch (error) {
      error = error as Error;

      // assert
      error.name.should.be.equal(errorType);
      fetchApiFixture.abortSpy.calledOnce.should.be.true();
    }
  }
}
