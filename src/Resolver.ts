/**
 * Promise resolver
 * @type {[type]}
 */
export type Resolver<T> = (value?: T | PromiseLike<T> | null) => void;
