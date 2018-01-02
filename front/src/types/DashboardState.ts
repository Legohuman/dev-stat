import * as moment from 'moment';

export interface DashboardState {
    operations: DashboardOperations;
    messages: DashboardErrorMessages;
    filter: DashboardFilterData;
    map: DashboardMapData;
    countryDetail: DashboardCountryDetailData;
}

export interface DashboardOperations {
    [operation: string]: boolean | undefined;
}

export interface DashboardErrorMessages {
    [key: string]: string | undefined;
}

export interface DashboardFilterData {
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

export interface DashboardMapData {
    countries: CountriesSummary;
}

export interface DashboardCountryDetailData {
    selectedCountry?: CountryInfo;
    selectedChartType?: ChartType;
    meanDev?: MeanDevSummary;
    charts: ChartsData;
}

export type ChartsData = {
    [P in keyof ChartType]?: ChartDataType;
    };

export interface ChartDataSet<T> {
    values: Array<T>;
    meanValue: number;
}

export interface ChartBin {
    height: number;
    x0: number;
    x1: number;
}

export interface ChartPoint {
    x: number;
    y: number;
}

export interface CountryInfo {
    id: string;
    name: string;
}

export interface CountriesSummary {
    [countryCode: string]: CountrySummary;
}

export interface CountrySummary {
    developersCount: number;
    vacancyCount: number;
    economyLevel: number;
}

export interface MeanDevSummary {
    age: number;
    salary: number;
    experience: number;
    companySize: number;
}

export enum ChartType {
    age = 'age',
    salary = 'salary',
    experience = 'experience',
    companySize = 'companySize'
}

export type ChartDataType = ChartDataSet<ChartBin> | ChartDataSet<ChartPoint>;