declare namespace NodeJS  {
    interface Global {
		AbortController: () => { abort: () => void };
		Headers: () => Map<string, string>;
		window: { fetch: (input: string | Request, init?: any) => void };
		fetch: (input: string | Request, init?: any) => void;
		XMLHttpRequest: sinon.SinonFakeXMLHttpRequestStatic;
    }
}