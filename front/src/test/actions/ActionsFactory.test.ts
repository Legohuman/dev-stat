import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as fetchMock from 'fetch-mock';
import { getDefaultDashboardState } from '../../reducers/DashboardReducer';
import { ActionsFactory } from '../../actions/ActionsFactory';
import { DashboardState } from '../../types/DashboardState';
import * as moment from 'moment';

const mockStore = configureMockStore<DashboardState>([thunk]);

afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
});

function response(status: number, data?: any) {
    return {
        body: {status, data},
        headers: {'content-type': 'application/json'}
    };
}

function success(data?: any) {
    return response(200, data);
}

it('handles period change not defined range', () => {
    fetchMock
        .get('end:/dashboard/countries/summary', success({
            RUS: {developersCount: 100, vacancyCount: 100, economyLevel: 1}
        }));
    const store = mockStore(getDefaultDashboardState());
    store.dispatch(ActionsFactory.handlePeriodChange(undefined, undefined));

    const expectedActions = [
        ActionsFactory.selectFilterPeriod(undefined, undefined),
        ActionsFactory.removeErrorMessage('filterValidationDates'),
        ActionsFactory.startAsyncOperation('getCountriesSummary'),
        ActionsFactory.selectCountry(undefined)
    ];
    expect(store.getActions()).toEqual(expectedActions);
});

it('handles period change defined correct range', () => {
    fetchMock
        .get('end:/dashboard/countries/summary', success({
            RUS: {developersCount: 100, vacancyCount: 100, economyLevel: 1}
        }));
    const store = mockStore(getDefaultDashboardState());
    const startDate = moment().startOf('y');
    const endDate = moment().endOf('y');
    store.dispatch(ActionsFactory.handlePeriodChange(startDate, endDate));

    const expectedActions = [
        ActionsFactory.selectFilterPeriod(startDate, endDate),
        ActionsFactory.removeErrorMessage('filterValidationDates'),
        ActionsFactory.startAsyncOperation('getCountriesSummary'),
        ActionsFactory.selectCountry(undefined)
    ];
    expect(store.getActions()).toEqual(expectedActions);
});

it('handles period change defined incorrect range', () => {
    fetchMock
        .get('end:/dashboard/countries/summary', success({
            RUS: {developersCount: 100, vacancyCount: 100, economyLevel: 1}
        }))
        .get('end:/dashboard/countries/RUS/meanDev', success({
            age: 25, salary: 2500, experience: 7, companySize: 100
        }));
    const state = getDefaultDashboardState();
    state.countryDetail.selectedCountry = {id: 'RUS', name: 'Russian Federation'};
    const store = mockStore(state);
    const startDate = moment().startOf('y');
    const endDate = moment().endOf('y');
    store.dispatch(ActionsFactory.handlePeriodChange(startDate, endDate));

    const expectedActions = [
        ActionsFactory.selectFilterPeriod(startDate, endDate),
        ActionsFactory.removeErrorMessage('filterValidationDates'),
        ActionsFactory.startAsyncOperation('getCountriesSummary'),
        ActionsFactory.selectCountry(state.countryDetail.selectedCountry),
        ActionsFactory.startAsyncOperation('getCountryMeanDev'),
        ActionsFactory.selectChartType(undefined)
    ];
    expect(store.getActions()).toEqual(expectedActions);
});