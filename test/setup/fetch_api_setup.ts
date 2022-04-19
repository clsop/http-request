import * as sinon from 'sinon';

global.fetch = (input: RequestInfo, init?: RequestInit) => new Promise<Response>((res, rej) => {});

let fetchSpy: sinon.SinonSpy = sinon.spy(global, "fetch");
let abortSpy: sinon.SinonSpy = sinon.spy(global.AbortController.prototype, "abort");

let reset = () => {
	abortSpy.resetHistory();
	fetchSpy.resetHistory();
};

export default {
	reset: reset,
	abortSpy: abortSpy,
	fetchSpy: fetchSpy,
};