import "should";
import { suite, test } from "@testdeck/mocha";

import XhrApi from "../src/request_api/xhr_api";
import xhrApiFixture from "./setup/xhr_api_setup";
import { fail } from "should";

@suite("xhr api tests")
class XhrRequestTests {
  private api: any;

  public static before() {}

  public static after() {
    global.XMLHttpRequest.restore();
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
    let api = new XhrApi({
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

  @test("set param headers when no additional headers")
  public async setParamHeaders() {
    // arrange
    const headers = {
      header1: "value 1",
      header2: "value 2",
    };
    this.api["params"].headers = headers;

    // act
    await Promise.all([
      this.api.execute(),
      new Promise((resolve: any, reject: any) => {
        xhrApiFixture.xmlHttpRequests[0].respond(200, null, null);
        resolve();
      }),
    ]);

    // assert
    xhrApiFixture.xmlHttpRequests[0].requestHeaders.should.be.deepEqual(
      headers
    );
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

    // act
    await Promise.all([
      this.api.execute(null, additionalRequestHeaders),
      new Promise((resolve: any, reject: any) => {
        xhrApiFixture.xmlHttpRequests[0].respond(200, null, null);
        resolve();
      }),
    ]);

    // assert
    xhrApiFixture.xmlHttpRequests[0].requestHeaders.should.be.deepEqual(
      expectedHeaders
    );
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

    // act
    await Promise.all([
      this.api.execute(null, additionalRequestHeaders),
      new Promise((resolve: any, reject: any) => {
        xhrApiFixture.xmlHttpRequests[0].respond(200, null, null);
        resolve();
      }),
    ]);

    // assert
    xhrApiFixture.xmlHttpRequests[0].requestHeaders.should.be.deepEqual(
      expectedHeaders
    );
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
    let errorType = "timeout";
    this.api.setTimeout(1000);

    try {
      // act
      await this.api.execute();
    } catch (reason: any) {
      // assert
      reason.should.be.equal(errorType);
    }
  }

  @test("execute without data")
  public async executeWithoutData() {
    // arrange
    let status = 200;

    try {
      // act
      await Promise.all([
        this.api.execute(),
        new Promise((resolve: any, reject: any) => {
          xhrApiFixture.xmlHttpRequests[0].respond(status, null, null);
          resolve();
        }),
      ]);

      // assert
      this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
      this.api["xhr"].status.should.be.equal(status);
    } catch (reason: any) {
      // assert
      fail("reject path", "resolve path");
    }
  }

  @test("execute with data")
  public async executeWithData() {
    // arrange
    const status = 200;
    const data = { test: "test!" };
    const responseData = JSON.stringify(data);

    try {
      // act
      await Promise.all([
        this.api.execute(data),
        new Promise((resolve: any, reject: any) => {
          xhrApiFixture.xmlHttpRequests[0].respond(status, null, responseData);
          resolve();
        }),
      ]);

      // assert
      const xhr = this.api["xhr"] as XMLHttpRequest;
      const parsedResponseData = JSON.parse(xhr.response) as typeof data;
      xhr.readyState.should.be.equal(XMLHttpRequest.DONE);
      xhr.status.should.be.equal(status);
      parsedResponseData.should.be.deepEqual(data);
    } catch (reason: any) {
      // assert
      fail("reject path", "resolve path");
    }
  }

  @test("execute with error")
  public async executeWithError() {
    // arrange
    let errorType = "error";
    let status = 0;

    try {
      // act
      await Promise.all([
        this.api.execute(),
        new Promise((resolve: any, reject: any) => {
          xhrApiFixture.xmlHttpRequests[0].error();
          resolve();
        }),
      ]);
    } catch (reason: any) {
      // assert
      reason.should.be.equal(errorType);
      this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.DONE);
      this.api["xhr"].status.should.be.equal(status);
    }
  }

  @test("can abort request")
  public async canAbortRequest() {
    // arrange
    let errorType = "abort";
    let status = 0;

    try {
      // act
      await Promise.all([
        this.api.execute(),
        new Promise((resolve: any, reject: any) => {
          this.api.abort();
          resolve();
        }),
      ]);
    } catch (reason: any) {
      // assert
      reason.should.be.equal(errorType);
      this.api["xhr"].readyState.should.be.equal(XMLHttpRequest.UNSENT);
      this.api["xhr"].status.should.be.equal(status);
    }
  }
}
