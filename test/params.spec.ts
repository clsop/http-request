import * as sinon from "sinon";
import "should";
import { suite, test } from "@testdeck/mocha";

import Params from "../src/request_api/params";
import should from "should";

@suite("param tests")
class ParamsTests {
  @test("can construct with defaults")
  public canConstructWithDefaults() {
    // arrange, act
    const params = new Params("test");

    // assert
    params.method.should.be.equal("GET");
    params.timeout.should.be.equal(0);
    params.useCredentials.should.be.False();
    params.headers.should.be.deepEqual({});
    should(params.username).be.Null();
    should(params.password).be.Null();
  }
}
