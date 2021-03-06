export default class TimeoutError extends Error {
	constructor(message?: string) {
		super(message);

		this.name = "timeout";
	}

	public toString = () => `${this.name}: ${this.message}`;
}