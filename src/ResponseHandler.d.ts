import Response from './Response';
/**
 * Handling data that goes onto a response
 */
export default class ResponseHandler<T> {
    private xhr;
    /**
     * Prepares data for Response class
     * @param  {XmlHttpRequest} xhr the XmlHttpRequest in DONE state
     * @return {void}
     */
    constructor(xhr: XMLHttpRequest);
    private formHeaders(xhr);
    isValidResponse(): boolean;
    getResponse(promiseType: number): Response<T>;
}
