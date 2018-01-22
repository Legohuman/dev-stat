import * as moment from 'moment';
import { Dispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import {
    ChartValuesType, CountriesSummary, CountryInfo, DashboardState, DeveloperMeasureType,
    MeanDevSummary
} from '../types/DashboardState';
import { DataService, PeriodAndCountryRequest, PeriodRequest } from '../service/DataService';
import {
    ActionType, ApplyChartData, ApplyCountriesSummary, ApplyMeanDevSummary, PutErrorMessages, SelectChartType,
    SelectCountry, SelectFilterPeriod
} from './Actions';
import { devMeasureDescriptorSelector } from '../utils/DevMeasureDescriptorSelector';
import { toasts } from '../utils/ToastUtils';
import { Validators } from '../utils/PropValidators';
import * as _ from 'lodash';

export const ActionsFactory = {
    handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): ThunkAction<void, DashboardState, any> {
        return (dispatch, getState) => {
            const effectiveStartDate = startDate && startDate.startOf('d'),
                effectiveEndDate = endDate && endDate.startOf('d');
            dispatch(ActionsFactory.selectFilterPeriod(effectiveStartDate, effectiveEndDate)); //to render updated values

            const validationErrors = getValidationErrors(effectiveStartDate, effectiveEndDate);
            if (validationErrors.length === 0) {
                dispatch(ActionsFactory.removeErrorMessage('filterValidationDates'));

                const periodRequest: PeriodRequest = {startDate: effectiveStartDate, endDate: effectiveEndDate};
                invokeAsync(dispatch, 'getCountriesSummary', () => DataService.getCountriesSummary(periodRequest))
                    .then(
                        result => dispatch(ActionsFactory.applyCountriesSummary(result.data || {})),
                        error => dispatch(ActionsFactory.applyCountriesSummary({}))
                    );

                changePeriodAndCountry(dispatch, getState, periodRequest, getState().countryDetail.selectedCountry);
            } else {
                dispatch(ActionsFactory.putErrorMessage('filterValidationDates', validationErrors));
                dispatch(ActionsFactory.applyCountriesSummary({}));
                dispatch(ActionsFactory.applyMeanDevSummary(undefined));
            }
        };
    },

    handleCountryChange(selectedCountry?: CountryInfo): ThunkAction<void, DashboardState, any> {
        return (dispatch, getState) => {
            const startDate = getState().filter.startDate,
                endDate = getState().filter.endDate;

            if (getValidationErrors(startDate, endDate).length === 0) {
                const periodRequest: PeriodRequest = {startDate, endDate};
                changePeriodAndCountry(dispatch, getState, periodRequest, selectedCountry);
            }
        };
    },

    handleChartChange(chartType?: DeveloperMeasureType): ThunkAction<void, DashboardState, any> {
        return (dispatch, getState) => {
            const startDate = getState().filter.startDate,
                endDate = getState().filter.endDate,
                selectedCountry = getState().countryDetail.selectedCountry;

            if (getValidationErrors(startDate, endDate).length === 0 && selectedCountry) {
                const periodAndCountryRequest: PeriodAndCountryRequest = {
                    startDate,
                    endDate,
                    countryId: selectedCountry.id
                };
                changeChartType(dispatch, getState, periodAndCountryRequest, chartType);
            }
        };
    },

    selectFilterPeriod(startDate?: moment.Moment, endDate?: moment.Moment): SelectFilterPeriod {
        return {
            type: ActionType.selectFilterPeriod,
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

    selectChartType(chartType?: DeveloperMeasureType): SelectChartType {
        return {
            type: ActionType.selectChartType,
            chartType
        };
    },

    applyCountriesSummary(summary: CountriesSummary): ApplyCountriesSummary {
        return {
            type: ActionType.applyCountriesSummary,
            summary
        };
    },

    applyMeanDevSummary(summary?: MeanDevSummary): ApplyMeanDevSummary {
        return {
            type: ActionType.applyMeanDevSummary,
            summary
        };
    },

    applyChartData(chartType: DeveloperMeasureType, data?: ChartValuesType): ApplyChartData {
        return {
            type: ActionType.applyChartData,
            chartType,
            data
        };
    },

    putErrorMessage(key: string, messages: string[]): PutErrorMessages {
        return {
            type: ActionType.putErrorMessage,
            key,
            messages: messages
        };
    },

    removeErrorMessage(key: string): PutErrorMessages {
        return {
            type: ActionType.putErrorMessage,
            key
        };
    },

    startAsyncOperation(operation: keyof typeof DataService) {
        return {type: ActionType.startAsyncOperation, operation};
    },

    finishAsyncOperation(operation: keyof typeof DataService) {
        return {type: ActionType.finishAsyncOperation, operation};
    }
};

function changePeriodAndCountry(dispatch: Dispatch<DashboardState>, getState: () => DashboardState,
                                periodRequest: PeriodRequest, selectedCountry?: CountryInfo) {
    dispatch(ActionsFactory.selectCountry(selectedCountry)); //to render updated values

    if (selectedCountry) {
        const periodAndCountryRequest: PeriodAndCountryRequest = {countryId: selectedCountry.id, ...periodRequest};
        invokeAsync(dispatch, 'getCountryMeanDev', () => DataService.getCountryMeanDev(periodAndCountryRequest))
            .then(
                result => dispatch(ActionsFactory.applyMeanDevSummary(result.data!!)),
                error => dispatch(ActionsFactory.applyMeanDevSummary(undefined))
            );

        changeChartType(dispatch, getState, periodAndCountryRequest, getState().countryDetail.selectedChartType);
    }
}

function getValidationErrors(startDate?: moment.Moment, endDate?: moment.Moment): string[] {
    const errors = [];
    if (startDate) {
        errors.push(Validators.saneDate('Start date', startDate));
    }
    if (endDate) {
        errors.push(Validators.saneDate('End date', endDate));
    }
    errors.push(Validators.datesInOrder(startDate, endDate));
    return _.compact(errors);
}

function changeChartType(dispatch: Dispatch<DashboardState>, getState: () => DashboardState,
                         periodAndCountryRequest: PeriodAndCountryRequest, selectedChartType?: DeveloperMeasureType) {
    dispatch(ActionsFactory.selectChartType(selectedChartType)); //to render updated values

    if (selectedChartType) {
        const descriptor = devMeasureDescriptorSelector.get(selectedChartType);
        invokeAsync(dispatch, descriptor.chartDataRequestOperation, () => descriptor.fetchChartData(periodAndCountryRequest))
            .then(
                result => dispatch(ActionsFactory.applyChartData(selectedChartType, result.data!!)),
                error => dispatch(ActionsFactory.applyChartData(selectedChartType, undefined))
            );
    }
}

function invokeAsync<T>(dispatch: Dispatch<any>, operation: keyof typeof DataService, requestFn: () => Promise<T>): Promise<T> {
    dispatch({type: ActionType.startAsyncOperation, operation});

    return requestFn().then(
        (result: T) => {
            dispatch({type: ActionType.finishAsyncOperation, operation});
            return result;
        }, error => {
            dispatch({type: ActionType.finishAsyncOperation, operation});
            (error.data as string[]).forEach(message => {
                toasts.error(message);
            });
            return Promise.reject(error);
        });
}
