import * as moment from 'moment';

const dateFormat = 'DD.MM.YYYY';

export default {
    toStringOrUndefined(val: string | number | undefined): string | undefined {
        return val === undefined ? undefined : val.toString();
    },
    momentToString(val?: moment.Moment): string | undefined {
        return val ? val.format(dateFormat) : val;
    }
};