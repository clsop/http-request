interface IParams {
	method: string;
	url: string;
	useCredentials: boolean;
	timeout: number;
	headers: Map<string, string>;
	username: string;
	password: string;
}