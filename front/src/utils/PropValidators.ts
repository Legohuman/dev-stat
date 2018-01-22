import * as moment from 'moment';
import { defaultDateFormat, maxDate, minDate } from './AppConstants';

export const Validators = {
    positiveNumber(propName: string, value: any): string | undefined {
        if (value <= 0) {
            return createError(propName, value, 'Positive number is expected.');
        }
        return undefined;
    },

    notNegativeNumber(propName: string, value: any): string | undefined {
        if (value < 0) {
            return createError(propName, value, 'Not negative number is expected.');
        }
        return undefined;
    },

    saneDate(propName: string, value: moment.Moment): string | undefined {
        if (!value.isValid()) {
            return `${propName} has invalid format. Expected date format is ${defaultDateFormat}`;
        }
        if (value.isBefore(minDate) || value.isAfter(maxDate)) {
            return `${propName} is out of range. Expected date range is ${minDate.format(defaultDateFormat)} - ${maxDate.format(defaultDateFormat)}`;
        }
        return undefined;
    },

    datesInOrder(startDate?: moment.Moment, endDate?: moment.Moment) {
        if (startDate && endDate && endDate.isBefore(startDate)) {
            return 'End date should be not less than start date';
        }
        return undefined;
    }
};

function createError(propName: string, value: any, errorMessage: string): string {
    return `Invalid value for ${propName}: ${value}. ${errorMessage}`;
}