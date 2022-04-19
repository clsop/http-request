declare namespace NodeJS {
	interface Global {
		XMLHttpRequest: sinon.SinonFakeXMLHttpRequestStatic;
	}
}