import * as moment from 'moment';

export enum ActionType {
    setFilterPeriod = 'setFilterPeriod',
    selectCountry = 'selectCountry',
}

export interface SetFilterPeriod {
    readonly type: typeof ActionType.setFilterPeriod;
    readonly startDate?: moment.Moment;
    readonly endDate?: moment.Moment;
}

export interface SelectCountry {
    readonly type: typeof ActionType.selectCountry;
    readonly countryCode?: string;
}

export type Action = SetFilterPeriod | SelectCountry;

export const ActionsFactory = {
    setFilterPeriod(startDate?: moment.Moment, endDate?: moment.Moment): SetFilterPeriod {
        return {
            type: ActionType.setFilterPeriod,
            startDate,
            endDate
        };
    },

    selectCountry(countryCode?: string): SelectCountry {
        return {
            type: ActionType.selectCountry,
            countryCode
        };
    },
};