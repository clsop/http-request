declare namespace NodeJS {
  interface Global {
    AbortController: typeof AbortController;
    fetch: () => void;
    XMLHttpRequest: sinon.SinonFakeXMLHttpRequestStatic;
    window: Window;
  }
}

declare var global: NodeJS.Global;