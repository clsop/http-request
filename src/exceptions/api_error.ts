export default class ApiError extends Error {
	constructor(message?: string) {
		super(message);

		this.name = "api";
	}

	public toString = () => `${this.name}: ${this.message}`;
}