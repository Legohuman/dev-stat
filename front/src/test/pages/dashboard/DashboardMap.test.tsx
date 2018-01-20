import * as React from 'react';
import { enzymeWrapperFactory } from '../../EnzymeWrapperFactory';
import { dashboardMockHandlers } from '../../DashboardMockHandlers';
import { DashboardMap } from '../../../pages/dashboard/DashboardMap';
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
        .countryTooltipText('RUS', ['Russia', '900 k', '11 k', 'below average'], ['Czech Republic', '80 k', '2000'])
        .countryTooltipText('CZE', ['Czech Republic', '80 k', '2000', 'below average'], ['Russia', '900 k', '11000'])
        .countryTooltipText('DEU', ['Germany'], ['80 k', '2000', 'below average'])
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
        .countryTooltipText('RUS', ['Russia'], ['900 k', '11000', 'below average'])
        .countryTooltipText('CZE', ['Czech Republic'], ['80 k', '2000', 'below average'])
        .countryTooltipText('DEU', ['Germany'], ['80 k', '2000', 'below average'])
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