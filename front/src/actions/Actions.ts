import * as moment from 'moment';
import { CountryInfo } from '../types/DashboardState';

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
    readonly country?: CountryInfo;
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

    selectCountry(country?: CountryInfo): SelectCountry {
        return {
            type: ActionType.selectCountry,
            country
        };
    },
};