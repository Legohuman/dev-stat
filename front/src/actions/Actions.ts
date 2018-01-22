import * as moment from 'moment';
import {
    ChartValuesType, CountriesSummary, CountryInfo, DeveloperMeasureType,
    MeanDevSummary
} from '../types/DashboardState';

export enum ActionType {
    startAsyncOperation = 'startAsyncOperation',
    finishAsyncOperation = 'finishAsyncOperation',
    putErrorMessage = 'putErrorMessage',
    selectFilterPeriod = 'selectFilterPeriod',
    selectCountry = 'selectCountry',
    selectChartType = 'selectChartType',
    applyCountriesSummary = 'applyCountriesSummary',
    applyMeanDevSummary = 'applyMeanDevSummary',
    applyChartData = 'applyChartData',
}

export interface StartAsyncOperation {
    readonly type: typeof ActionType.startAsyncOperation;
    readonly operation: string;
}

export interface FinishAsyncOperation {
    readonly type: typeof ActionType.finishAsyncOperation;
    readonly operation: string;
}

export interface PutErrorMessages {
    readonly type: typeof ActionType.putErrorMessage;
    readonly key: string;
    readonly messages?: string[];
}

export interface SelectFilterPeriod {
    readonly type: typeof ActionType.selectFilterPeriod;
    readonly startDate?: moment.Moment;
    readonly endDate?: moment.Moment;
}

export interface SelectCountry {
    readonly type: typeof ActionType.selectCountry;
    readonly country?: CountryInfo;
}

export interface SelectChartType {
    readonly type: typeof ActionType.selectChartType;
    readonly chartType?: DeveloperMeasureType;
}

export interface ApplyCountriesSummary {
    readonly type: typeof ActionType.applyCountriesSummary;
    readonly summary: CountriesSummary;
}

export interface ApplyMeanDevSummary {
    readonly type: typeof ActionType.applyMeanDevSummary;
    readonly summary?: MeanDevSummary;
}

export interface ApplyChartData {
    readonly type: typeof ActionType.applyChartData;
    readonly chartType: DeveloperMeasureType;
    readonly data?: ChartValuesType;
}

export type Action = StartAsyncOperation | FinishAsyncOperation | PutErrorMessages |
    SelectFilterPeriod | SelectCountry | SelectChartType |
    ApplyCountriesSummary | ApplyMeanDevSummary | ApplyChartData;