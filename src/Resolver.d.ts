/**
 * Promise resolver
 * @type {[type]}
 */
export declare type Resolver<T> = (value?: T | PromiseLike<T> | null) => void;
