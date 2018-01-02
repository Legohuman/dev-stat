import * as moment from 'moment';
import { ChartDataType, ChartType, CountriesSummary, CountryInfo, MeanDevSummary } from '../types/DashboardState';

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

export interface PutErrorMessage {
    readonly type: typeof ActionType.putErrorMessage;
    readonly key: string;
    readonly message?: string;
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
    readonly chartType?: ChartType;
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
    readonly chartType: ChartType;
    readonly data?: ChartDataType;
}

export type Action = StartAsyncOperation | FinishAsyncOperation | PutErrorMessage |
    SelectFilterPeriod | SelectCountry | SelectChartType |
    ApplyCountriesSummary | ApplyMeanDevSummary | ApplyChartData;