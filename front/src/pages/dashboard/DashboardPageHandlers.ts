import * as moment from 'moment';
import { Dispatch } from 'react-redux';
import { ChartType, CountryInfo, DashboardState } from '../../types/DashboardState';
import { ActionsFactory } from '../../actions/ActionsFactory';

export interface DashboardPageHandlers {
    handlers: {
        handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): void

        handleCountryChange(country?: CountryInfo): void

        handleChartChange(chartType?: ChartType): void
    };
}

export function createDashboardPageHandlers(dispatch: Dispatch<DashboardState &
    DashboardPageHandlers>): DashboardPageHandlers {
    return {
        handlers: {
            handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): void {
                dispatch(ActionsFactory.handlePeriodChange(startDate, endDate));
            },
            handleCountryChange(country?: CountryInfo): void {
                dispatch(ActionsFactory.handleCountryChange(country));
            },
            handleChartChange(chartType?: ChartType): void {
                dispatch(ActionsFactory.handleChartChange(chartType));
            }
        }
    };
}