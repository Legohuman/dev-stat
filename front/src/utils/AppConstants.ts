import * as moment from 'moment';

export const defaultDateFormat = 'DD.MM.YYYY';
export const minDate = moment({year: 1900});
export const maxDate = moment({year: 2099, month: 11, day: 31});