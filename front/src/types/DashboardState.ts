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
    ageDistribution: Array<CountBin>,
    salaryDistribution: Array<CountBin>,
    experienceDistribution: Array<CountBin>,
    companySizeDistribution: Array<CountBin>,
}

interface CountBin {
    count: number,
    intervalStart: number,
    intervalEnd: number
}
