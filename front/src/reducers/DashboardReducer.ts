import * as moment from 'moment';
import {
    Action, ActionType, ApplyChartData, ApplyCountriesSummary, ApplyMeanDevSummary, FinishAsyncOperation,
    PutErrorMessages, SelectChartType, SelectCountry, SelectFilterPeriod, StartAsyncOperation
} from '../actions/Actions';
import { DashboardState } from '../types/DashboardState';
import { ActionHandlerSelector } from '../utils/ActionHandlerSelector';

const handlerSelector = new ActionHandlerSelector<DashboardState>()
    .addHandler(ActionType.putErrorMessage, (action, state) => {
        const actionImpl = <PutErrorMessages> action;
        return {
            ...state,
            messages: {
                ...state.messages,
                [actionImpl.key]: actionImpl.messages
            }
        };
    })
    .addHandler(ActionType.selectFilterPeriod, (action, state) => {
        const actionImpl = <SelectFilterPeriod> action;
        return {
            ...state,
            filter: {
                ...state.filter,
                startDate: actionImpl.startDate,
                endDate: actionImpl.endDate
            }
        };
    })
    .addHandler(ActionType.selectCountry, (action, state) => {
        const actionImpl = <SelectCountry> action;
        return {...state, countryDetail: {...state.countryDetail, selectedCountry: actionImpl.country}};
    })
    .addHandler(ActionType.selectChartType, (action, state) => {
        const actionImpl = <SelectChartType> action;
        return {...state, countryDetail: {...state.countryDetail, selectedChartType: actionImpl.chartType}};
    })
    .addHandler(ActionType.applyCountriesSummary, (action, state) => {
        const actionImpl = <ApplyCountriesSummary> action;
        return {...state, map: {...state.map, countries: actionImpl.summary}};
    })
    .addHandler(ActionType.applyMeanDevSummary, (action, state) => {
        const actionImpl = <ApplyMeanDevSummary> action;
        return {
            ...state, countryDetail: {
                ...state.countryDetail, meanDev: actionImpl.summary
            }
        };
    })
    .addHandler(ActionType.applyChartData, (action, state) => {
        const actionImpl = <ApplyChartData> action;
        return {
            ...state, countryDetail: {
                ...state.countryDetail, charts: {
                    ...state.countryDetail.charts, [actionImpl.chartType]: actionImpl.data
                }
            }
        };
    })
    .addHandler(ActionType.startAsyncOperation, (action, state) => {
        const actionImpl = <StartAsyncOperation> action;
        return {
            ...state,
            operations: {
                ...state.operations,
                [actionImpl.operation]: true
            }
        };
    })
    .addHandler(ActionType.finishAsyncOperation, (action, state) => {
        const actionImpl = <FinishAsyncOperation> action;
        return {
            ...state,
            operations: {
                ...state.operations,
                [actionImpl.operation]: false
            }
        };
    });

export function getDefaultDashboardState(): DashboardState {
    return {
        operations: {},
        messages: {},
        filter: {
            startDate: moment().startOf('y'),
            endDate: moment().endOf('y')
        },
        map: {
            countries: {}
        },
        countryDetail: {
            selectedCountry: undefined,
            meanDev: undefined,
            charts: {},
            selectedChartType: undefined
        }
    };
}

export default function nextState(state: DashboardState = getDefaultDashboardState(), action: Action): DashboardState {
    return handlerSelector.handle(action, state);
}
