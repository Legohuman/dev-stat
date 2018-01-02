export interface DataResponse<T> {
    status: number;
    message?: string;
    data?: T;
}

const baseServiceUrl = '/';
const postPutHeaders = {
    'Content-Type': 'application/json;charset=UTF-8'
};

function getJson(response: Response) {
    return response.json().then(
        data => {
            if (response.status >= 200 && response.status < 300) {
                return {status: response.status, data: data}
            }
            throw {status: response.status, data: data};
        },
        error => {
            throw {status: response.status, message: 'Unable to parse JSON'};
        }
    )
}

function handleError(error: any) {
    return Promise.reject({status: -1, message: error && error.toString()});
}

function fetchData<T>(request: RequestInfo, init?: RequestInit): Promise<DataResponse<T>> {
    try {
        return fetch(request, init)
            .then(getJson, handleError)
    } catch (e) {
        return Promise.reject({status: -1, message: e.toString()});
    }
}

const RestService = {

    /**
     * Makes GET request to server
     * @param url relative server url. Will be prefixed with Config.baseServiceUrl
     * @param init additional request options
     * @return {*} promise
     */
    get<T>(url: string, init?: RequestInit): Promise<DataResponse<T>> {
        return fetchData(new Request(baseServiceUrl + url), init)
    },

    /**
     * Makes POST request to server
     * @param url relative server url. Will be prefixed with Config.baseServiceUrl
     * @param data object that will be serialized to JSON and sent to server
     * @param init additional request options
     * @return {*} promise
     */
    post<T, R>(url: string, data: T, init?: RequestInit): Promise<DataResponse<R>> {
        return fetchData(new Request(baseServiceUrl + url),
            Object.assign({
                method: 'POST',
                headers: postPutHeaders,
                body: JSON.stringify(data || null)
            }, init))
    },

    /**
     * Makes PUT request to server
     * @param url relative server url. Will be prefixed with Config.baseServiceUrl
     * @param data object that will be serialized to JSON and sent to server
     * @param init additional request options
     * @return {*} promise
     */
    put<T, R>(url: string, data: T, init?: RequestInit): Promise<DataResponse<R>> {
        return fetchData(new Request(baseServiceUrl + url),
            Object.assign({
                method: 'PUT',
                headers: postPutHeaders,
                body: JSON.stringify(data || null)
            }, init))
    },

    /**
     * Makes DELETE request to server
     * @param url relative server url. Will be prefixed with Config.baseServiceUrl
     * @param init additional request options
     * @return {*} promise
     */
    delete<T>(url: string, init?: RequestInit): Promise<DataResponse<T>> {
        return fetchData(new Request(baseServiceUrl + url),
            Object.assign({
                method: 'DELETE',
            }, init))
    }
};

export default RestService