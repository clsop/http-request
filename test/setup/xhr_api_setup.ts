import * as sinon from 'sinon';

let xmlHttpRequests: Array<sinon.SinonFakeXMLHttpRequest> = new Array<sinon.SinonFakeXMLHttpRequest>();
global.XMLHttpRequest.prototype = sinon.useFakeXMLHttpRequest();
global.XMLHttpRequest.onCreate = (xhr: sinon.SinonFakeXMLHttpRequest) => {
	xmlHttpRequests.push(xhr);
}

let reset = () => {
	xmlHttpRequests.splice(0, xmlHttpRequests.length);
};

export default {
	reset: reset,
	xmlHttpRequests: xmlHttpRequests
};