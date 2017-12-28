import * as moment from 'moment';

export interface DashboardState {
    filter: DashboardFilterData,
    map: DashboardMapData,
    countryDetail: DashboardCountryDetailData
}

export interface DashboardFilterData {
    startDate?: moment.Moment,
    endDate?: moment.Moment
}

export interface DashboardMapData {
    selectedCountryCode?: string
}

export interface DashboardCountryDetailData {
    meanAge: number,
    meanSalary: number,
    meanExperience: number,
    meanCompanySize: number,
    ageDistribution: Array<ChartBin>,
    salaryDistribution: Array<ChartPoint>,
    experienceDistribution: Array<ChartBin>,
    companySizeDistribution: Array<ChartBin>,
}

export interface ChartBin {
    height: number,
    x0: number,
    x1: number
}

export interface ChartPoint {
    x: number,
    y: number
}
