import { IProgressEvent } from './IProgressEvent';
import { IBaseResponse } from './IResponse';

export type Eagerness = "NOW" | "NO_HURRY" | "HURRY" | "PATIENT" | "REAL_PATIENT" | "WHENEVER";

export interface IHttpRequest<T> {
	setPatience(eagerness?: Eagerness): void;
	setUrl(url: string): void;
	setHeader(header: string, value: string): void;
	useCreadentials(useThem: boolean): void;
	setProgressHandler(callback: (this: XMLHttpRequest, e: IProgressEvent) => any): void;

	then(callback: (value: IBaseResponse<T>) => T | PromiseLike<T>): Promise<T>;
	catch(callback: (reason: any) => T | PromiseLike<T>): Promise<T | IBaseResponse<T>>;
	cancel(): void;
	send(method?: string, data?: T): void;
}