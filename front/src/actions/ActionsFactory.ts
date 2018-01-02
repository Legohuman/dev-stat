import * as moment from 'moment';
import { Dispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import {
    ChartDataType, ChartType, CountriesSummary, CountryInfo, DashboardState,
    MeanDevSummary
} from "../types/DashboardState";
import { DataService, PeriodAndCountryRequest, PeriodRequest } from "../service/DataService";
import {
    ActionType, ApplyChartData, ApplyCountriesSummary, ApplyMeanDevSummary, PutErrorMessage, SelectChartType,
    SelectCountry, SelectFilterPeriod
} from "./Actions";
import { devMeasureDescriptorSelector } from "../utils/DevMeasureDescriptorSelector";

export const ActionsFactory = {
    handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): ThunkAction<void, DashboardState, any> {
        return (dispatch, getState) => {
            const effectiveStartDate = startDate && startDate.startOf('d'),
                effectiveEndDate = endDate && endDate.startOf('d');
            dispatch(setFilterPeriod(effectiveStartDate, effectiveEndDate)); //to render updated values

            if (isValidDates(effectiveStartDate, effectiveEndDate)) {
                dispatch(removeErrorMessage('filterValidationDates'));

                const periodRequest: PeriodRequest = {startDate: effectiveStartDate, endDate: effectiveEndDate};
                invokeAsync(dispatch, 'getCountriesSummary', () => DataService.getCountriesSummary(periodRequest))
                    .then(
                        result => dispatch(applyCountriesSummary(result.data || {})),
                        error => dispatch(applyCountriesSummary({}))
                    );

                changePeriodAndCountry(dispatch, getState, periodRequest, getState().countryDetail.selectedCountry);
            } else {
                dispatch(addErrorMessage('filterValidationDates', 'End date is expected to be not less than start date'));
            }
        };
    },

    handleCountryChange(selectedCountry?: CountryInfo): ThunkAction<void, DashboardState, any> {
        return (dispatch, getState) => {
            const startDate = getState().filter.startDate,
                endDate = getState().filter.endDate;

            if (isValidDates(startDate, endDate)) {
                const periodRequest: PeriodRequest = {startDate, endDate};
                changePeriodAndCountry(dispatch, getState, periodRequest, selectedCountry)
            }
        };
    },

    handleChartChange(chartType?: ChartType): ThunkAction<void, DashboardState, any> {
        return (dispatch, getState) => {
            const startDate = getState().filter.startDate,
                endDate = getState().filter.endDate,
                selectedCountry = getState().countryDetail.selectedCountry;

            if (isValidDates(startDate, endDate) && selectedCountry) {
                const periodAndCountryRequest: PeriodAndCountryRequest = {
                    startDate,
                    endDate,
                    countryId: selectedCountry.id
                };
                changeChartType(dispatch, getState, periodAndCountryRequest, chartType)
            }
        };
    }
};


function changePeriodAndCountry(dispatch: Dispatch<DashboardState>, getState: () => DashboardState,
                                periodRequest: PeriodRequest, selectedCountry?: CountryInfo) {
    dispatch(selectCountry(selectedCountry)); //to render updated values

    if (selectedCountry) {
        const periodAndCountryRequest: PeriodAndCountryRequest = {countryId: selectedCountry.id, ...periodRequest};
        invokeAsync(dispatch, 'getCountryMeanDev', () => DataService.getCountryMeanDev(periodAndCountryRequest))
            .then(
                result => dispatch(applyMeanDevSummary(result.data!!)),
                error => dispatch(applyMeanDevSummary(undefined))
            );

        changeChartType(dispatch, getState, periodAndCountryRequest, getState().countryDetail.selectedChartType);
    }
}

function isValidDates(startDate?: moment.Moment, endDate?: moment.Moment) {
    return !startDate || !endDate || !endDate.isBefore(startDate);
}

function changeChartType(dispatch: Dispatch<DashboardState>, getState: () => DashboardState,
                         periodAndCountryRequest: PeriodAndCountryRequest, selectedChartType?: ChartType) {
    dispatch(selectChartType(selectedChartType)); //to render updated values

    if (selectedChartType) {
        const descriptor = devMeasureDescriptorSelector.get(selectedChartType);
        invokeAsync(dispatch, descriptor.chartDataRequestOperation, () => descriptor.fetchChartData(periodAndCountryRequest))
            .then(
                result => dispatch(applyChartData(selectedChartType, result.data!!)),
                error => dispatch(applyChartData(selectedChartType, undefined))
            );
    }
}

function invokeAsync<T>(dispatch: Dispatch<any>, operation: keyof typeof DataService, requestFn: () => Promise<T>): Promise<T> {
    dispatch({type: ActionType.startAsyncOperation, operation});

    return requestFn().then((result: T) => {
        dispatch({type: ActionType.finishAsyncOperation, operation});
        return result;
    }, error => {
        dispatch({type: ActionType.finishAsyncOperation, operation});
        return Promise.reject(error);
    });
}

function setFilterPeriod(startDate?: moment.Moment, endDate?: moment.Moment): SelectFilterPeriod {
    return {
        type: ActionType.selectFilterPeriod,
        startDate,
        endDate
    };
}

function selectCountry(country?: CountryInfo): SelectCountry {
    return {
        type: ActionType.selectCountry,
        country
    };
}

function selectChartType(chartType?: ChartType): SelectChartType {
    return {
        type: ActionType.selectChartType,
        chartType
    };
}

function applyCountriesSummary(summary: CountriesSummary): ApplyCountriesSummary {
    return {
        type: ActionType.applyCountriesSummary,
        summary
    };
}

function applyMeanDevSummary(summary?: MeanDevSummary): ApplyMeanDevSummary {
    return {
        type: ActionType.applyMeanDevSummary,
        summary
    };
}

function applyChartData(chartType: ChartType, data?: ChartDataType): ApplyChartData {
    return {
        type: ActionType.applyChartData,
        chartType,
        data
    };
}

function addErrorMessage(key: string, message: string): PutErrorMessage {
    return {
        type: ActionType.putErrorMessage,
        key,
        message
    };
}

function removeErrorMessage(key: string): PutErrorMessage {
    return {
        type: ActionType.putErrorMessage,
        key
    };
}
