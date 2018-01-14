import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as fetchMock from 'fetch-mock'
import { getDefaultDashboardState } from '../../reducers/DashboardReducer';
import { ActionsFactory } from '../../actions/ActionsFactory';
import { DashboardState } from '../../types/DashboardState';

const mockStore = configureMockStore<DashboardState>([thunk]);

afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
});

it('handles period change not defined range', () => {
    fetchMock
        .get('end:/dashboard/countries/summary', {
            body: {status: 200, data: {RUS: {developersCount: 100, vacancyCount: 100, economyLevel: 1}}},
            headers: {'content-type': 'application/json'}
        });
    const store = mockStore(getDefaultDashboardState());
    store.dispatch(ActionsFactory.handlePeriodChange(undefined, undefined));

    const expectedActions = [
        ActionsFactory.selectFilterPeriod(undefined, undefined),
        ActionsFactory.removeErrorMessage('filterValidationDates'),
        ActionsFactory.startAsyncOperation('getCountriesSummary'),
        ActionsFactory.selectCountry(undefined)
    ];
    expect(store.getActions()).toEqual(expectedActions)
});