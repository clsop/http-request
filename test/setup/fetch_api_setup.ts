import * as sinon from 'sinon';
import 'isomorphic-fetch'

let fetchSpy: sinon.SinonStub = sinon.stub(global, "fetch");
let abortSpy: sinon.SinonStub = sinon.stub(global.AbortController.prototype, "abort");

fetchSpy.callThrough();
abortSpy.callThrough();

let reset = () => {
	abortSpy.resetHistory();
	fetchSpy.resetHistory();
};

export default {
	reset: reset,
	abortSpy: abortSpy,
	fetchSpy: fetchSpy,
};