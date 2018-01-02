import * as moment from 'moment';

const dateFormat = 'DD.MM.YYYY';

export default {
    toStringOrUndefined(val: any): string | undefined {
        return val ? val.toString() : undefined;
    },
    momentToString(val?: moment.Moment): string | undefined {
        return val ? val.format(dateFormat) : val;
    }
};