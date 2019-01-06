declare module NodeJS  {
    interface Global {
		AbortController: () => { abort: () => void };
		Headers: () => Map<string, string>;
		fetch: (input: string | Request, init?: any) => void;
		XMLHttpRequest: sinon.SinonFakeXMLHttpRequestStatic;
    }
}