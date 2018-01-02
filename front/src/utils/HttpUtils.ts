import * as _ from 'lodash';

export default {
    objToQueryString(obj: any): string {
        const query = internalObjToQueryString(obj, '');
        return query ? '?' + query : '';
    }
};

function internalObjToQueryString(obj: any, prefix: string): string {
    return obj && Object.keys(obj)
        .map(key => {
            const val = obj[key];
            if (val) {
                if (_.isObject(val)) {
                    return internalObjToQueryString(val, key + '.')
                } else {
                    return (encodeURIComponent(prefix) || '') + encodeURIComponent(key) + '=' + encodeURIComponent(val)
                }
            }
            return null;
        }).filter(val => !!val).join('&');
}
