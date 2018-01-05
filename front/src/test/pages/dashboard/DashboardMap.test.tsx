import * as React from 'react';
import { enzymeWrapperFactory } from '../../EnzymeWrapperFactory';
import { dashboardMockHandlers } from '../../DashboardMockHandlers';
import DashboardMap from '../../../pages/dashboard/DashboardMap';
import { DashboardMapAssertFactory } from './DashboardMapAssertFactory';

afterEach(enzymeWrapperFactory.unmount);

it('check tooltip rendering', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = enzymeWrapperFactory.mount(
        <DashboardMap
            countries={getCountries()}
            handlers={handlers}
        />
    );
    new DashboardMapAssertFactory(wrapper).assertMap()
        .rendered()
        .countryTooltipText('RUS', ['Russia', '900000', '11000', '3'], ['Czech Republic', '80000', '2000'])
        .countryTooltipText('CZE', ['Czech Republic', '80000', '2000', '3'], ['Russia', '900000', '11000'])
        .countryTooltipText('DEU', ['Germany'], ['80000', '2000', '3'])
        .countriesClickHandled(['RUS', 'CZE', 'DEU'], handlers.handleCountryChange);
});

it('check update with empty countries data', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = enzymeWrapperFactory.mount(
        <DashboardMap
            countries={getCountries()}
            handlers={handlers}
        />
    );
    wrapper.setProps({
        countries: {}
    });

    new DashboardMapAssertFactory(wrapper).assertMap()
        .rendered()
        .countryTooltipText('RUS', ['Russia'], ['900000', '11000', '3'])
        .countryTooltipText('CZE', ['Czech Republic'], ['80000', '2000', '3'])
        .countryTooltipText('DEU', ['Germany'], ['80000', '2000', '3'])
        .countriesClickHandled(['RUS', 'CZE', 'DEU'], handlers.handleCountryChange);
});

function getCountries() {
    return {
        'RUS': {
            developersCount: 900000,
            vacancyCount: 11000,
            economyLevel: 3,
        },
        'CZE': {
            developersCount: 80000,
            vacancyCount: 2000,
            economyLevel: 3,
        }
    };
}