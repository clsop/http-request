import "should";
import { describe, beforeEach } from "mocha";
import { suite, test } from "@testdeck/mocha";
import * as sinon from "sinon";

import "./setup/xhr_api_setup";
import "./setup/fetch_api_setup";
import ErrorMessage from "../src/errors";
import FetchApi from "../src/request_api/fetch_api";
import XhrApi from "../src/request_api/xhr_api";
import { HttpRequest } from "../src/http_request";

describe("http request tests", () => {
  let request: any;

  beforeEach(() => {
    request = new HttpRequest({ url: "http://fakeRequest.local" });
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
      let apiSelector: HttpRequest.Api = "XHR";

      // act
      let request = new HttpRequest({}, apiSelector);

      // assert
      request["api"].should.be.instanceof(XhrApi);
    }

    @test("should fallback to xhr with warning when fetch is not available")
    public fallbackWhenNotAvailable() {
      // arrange
      const apiSelection: HttpRequest.Api = "FETCH";
      const consoleSpy = sinon.spy(console, "warn");
      delete global.fetch;

      // act
      const httpRequest = new HttpRequest(null, apiSelection);

      // assert
      httpRequest["api"].should.be.instanceof(XhrApi);
      consoleSpy.calledOnce.should.be.True();
    }

    @test.pending("should use web workers if available")
    public useWebWorkers() {
      // arrange
      // act
      // assert
    }
  }

  @suite("setPatience method")
  class SetPatience {
    @test("should use patient eagerness timeout as default")
    public defaultWhenever() {
      // arrange
      const timeout = 10000;

      // assert
      request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
    }

    @test("should be able to set eagerness")
    public setEagerness() {
      // arrange
      let eagerness: HttpRequest.Eagerness = "NO_HURRY";
      let timeout = 2000;

      // act
      request.setPatience(eagerness);

      // assert
      request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
    }
  }

  @suite("setHeader method")
  class SetHeader {
    @test("should add one header entry")
    public headerEntry() {
      // arrange
      let header = { name: "Accept", value: "*" };

      // act
      request.setHeader(header.name, header.value);

      // asssert
      (header.name in request["parameters"].headers).should.be.True();
      request["parameters"].headers[header.name].should.be.equal(header.value);
    }

    @test("should throw exception when header is already present")
    public throwException() {
      // arrange
      let header = { name: "Accept", value: "*" };

      // act
      request.setHeader(header.name, header.value);
      let expectation = () =>
        request.setHeader(header.name, "application/json");

      // assert
      expectation.should.throw(ErrorMessage.HEADER_DEFINED);
    }
  }

  @suite("setUrl method")
  class SetUrl {
    @test("should throw exception when non url")
    public urlNotValid() {
      // arrange
      let expectations = [
        () => request.setUrl(null),
        () => request.setUrl(undefined),
        () => request.setUrl(""),
        () => request.setUrl("file://fakeRequest"),
        () => request.setUrl("http://fakeRequest"),
      ];

      // act, assert
      expectations.forEach((value) => {
        value.should.throw(ErrorMessage.INVALID_URL);
      });
    }

    @test("should not throw exception when valid url")
    public validUrl() {
      // arrange
      let expectation = () => request.setUrl("http://fakeRequest.local");

      // act, assert
      expectation.should.not.throw(ErrorMessage.INVALID_URL);
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
      let eagerness: HttpRequest.Eagerness = "NO_HURRY";
      let timeout = 2000;

      // act
      request.setPatience(eagerness);

      // assert
      request["api"]["params"].timeout.should.equal(timeout).and.be.a.Number();
    }
  }

  @suite("execute method")
  class Execute {
    @test("should not throw exception when valid url")
    public validUrl() {
      // arrange
      let expectations = [
        () => {
          request.setUrl("http://fakeRequest.local");
          request.send();
        },
        () => {
          request.setUrl("http://www.fakeRequest.com");
          request.send();
        },
        () => {
          request.setUrl("https://www.fakeRequest.org");
          request.send();
        },
      ];

      // act
      expectations.forEach((value) => {
        // assert
        value.should.not.throw(ErrorMessage.INVALID_URL);
      });
    }

    @test("should throw exception when no url")
    public emptyUrl() {
      // arrange
      let expectations = [
        () => {
          request.setUrl(null);
          request.send();
        },
        () => {
          request.setUrl(undefined);
          request.send();
        },
        () => {
          request.setUrl("");
          request.send();
        },
        () => {
          request.setUrl("  ");
          request.send();
        },
      ];

      // act, assert
      expectations.forEach((value) =>
        value.should.throw(ErrorMessage.INVALID_URL)
      );
    }

    @test("should throw exception when url is not valid (non url)")
    public invalidUrl() {
      // arrange
      let expectations = [
        () => {
          request.setUrl("file://fakeRequest");
          request.send();
        },
        () => {
          request.setUrl("http://fakeRequest");
          request.send();
        },
      ];

      // act, assert
      expectations.forEach((value) =>
        value.should.throw(ErrorMessage.INVALID_URL)
      );
    }
  }
});
