export interface DashboardState {
    filter: DashboardFilterData,
    map: DashboardMapData,
    countryDetail: DashboardCountryDetailData
}

export interface DashboardFilterData {
    startDate: Date,
    endDate: Date
}

export interface DashboardMapData {
    selectedCountryCode: string
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
