declare module NodeJS {
	interface Global {
		XMLHttpRequest: sinon.SinonFakeXMLHttpRequestStatic;
	}
}