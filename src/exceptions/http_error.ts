export default class HttpError extends Error {
	protected info: string;

	constructor(name: string, message: string, info: string) {
		super(message);

		this.info = info;
		this.name = name;
	}

	public toString = () => `${this.name}: ${this.message}\r\ninfo: ${this.info}`;
}