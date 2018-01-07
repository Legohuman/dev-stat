import * as moment from 'moment';
import RestService, { DataResponse } from './RestService';
import HttpUtils from '../utils/HttpUtils';
import ConversionUtils from '../utils/ConversionUtils';
import { ChartBin, ChartDataSet, ChartPoint, CountriesSummary, MeanDevSummary } from '../types/DashboardState';

function getDateQueryObject(filterData: PeriodRequestPart): any {
    return {
        startDate: ConversionUtils.momentToString(filterData.startDate),
        endDate: ConversionUtils.momentToString(filterData.endDate)
    };
}

export const DataService = {
    getCountriesSummary(request: PeriodRequest): Promise<DataResponse<CountriesSummary>> {
        return RestService.get('dashboard/countries/summary' + HttpUtils.objToQueryString(getDateQueryObject(request)));
    },

    getCountryMeanDev(request: PeriodAndCountryRequest): Promise<DataResponse<MeanDevSummary>> {
        return RestService.get('dashboard/countries/' + request.countryId + '/meanDev' + HttpUtils.objToQueryString(getDateQueryObject(request)));
    },

    getDevAgeChart(request: PeriodAndCountryRequest): Promise<DataResponse<ChartDataSet<ChartBin>>> {
        return RestService.get('dashboard/countries/' + request.countryId + '/charts/age' + HttpUtils.objToQueryString(getDateQueryObject(request)));
    },

    getDevSalaryChart(request: PeriodAndCountryRequest): Promise<DataResponse<ChartDataSet<ChartPoint>>> {
        return RestService.get('dashboard/countries/' + request.countryId + '/charts/salary' + HttpUtils.objToQueryString(getDateQueryObject(request)));
    },

    getDevExperienceChart(request: PeriodAndCountryRequest): Promise<DataResponse<ChartDataSet<ChartBin>>> {
        return RestService.get('dashboard/countries/' + request.countryId + '/charts/experience' + HttpUtils.objToQueryString(getDateQueryObject(request)));
    },

    getDevCompanySizeChart(request: PeriodAndCountryRequest): Promise<DataResponse<ChartDataSet<ChartBin>>> {
        return RestService.get('dashboard/countries/' + request.countryId + '/charts/companySize' + HttpUtils.objToQueryString(getDateQueryObject(request)));
    }
};

interface PeriodRequestPart {
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

interface CountryRequestPart {
    countryId: string;
}

export type PeriodRequest = PeriodRequestPart;
export type PeriodAndCountryRequest = PeriodRequestPart & CountryRequestPart;
