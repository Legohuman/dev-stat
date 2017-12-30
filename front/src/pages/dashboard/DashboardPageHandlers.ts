import * as moment from 'moment';
import { Dispatch } from 'react-redux';
import { CountryInfo, DashboardState } from '../../types/DashboardState';
import { ActionsFactory } from '../../actions/Actions';

export interface DashboardPageHandlers {
    handlers: {
        handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): void

        selectCountry(country?: CountryInfo): void
    };
}

export function createDashboardPageHandlers(dispatch: Dispatch<DashboardState &
    DashboardPageHandlers>): DashboardPageHandlers {
    return {
        handlers: {
            handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): void {
                dispatch(ActionsFactory.setFilterPeriod(startDate, endDate));
            },
            selectCountry(country?: CountryInfo): void {
                dispatch(ActionsFactory.selectCountry(country));
            }
        }
    };
}