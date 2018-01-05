import * as React from 'react';
import * as moment from 'moment';
import DashboardFilter from '../../../../src/pages/dashboard/DashboardFilter';
import { defaultDateFormat } from '../../../components/DatePicker'
import { enzymeWrapperFactory } from '../../EnzymeWrapperFactory';
import { dashboardMockHandlers } from '../../DashboardMockHandlers';

const defaultStartDate = moment().subtract(7, 'd'),
    defaultEndDate = moment();

afterEach(enzymeWrapperFactory.unmount);

it('renders dashboard filter with defined start and end dates', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <DashboardFilter
            startDate={defaultStartDate}
            endDate={defaultEndDate}
            handlers={dashboardMockHandlers()}
        />
    );

    const rootElem = wrapper.find('.DashboardFilter');
    expect(rootElem).toHaveLength(1);

    const inputs = rootElem.find('input');
    expect(inputs).toHaveLength(2);

    const startDateInput = inputs.at(0);
    expect(startDateInput.prop('value')).toBe(defaultStartDate.format(defaultDateFormat));
    const endDateInput = inputs.at(1);
    expect(endDateInput.prop('value')).toBe(defaultEndDate.format(defaultDateFormat));
});

it('renders dashboard filter with undefined start and end dates', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <DashboardFilter
            startDate={undefined}
            endDate={undefined}
            handlers={dashboardMockHandlers()}
        />
    );

    const rootElem = wrapper.find('.DashboardFilter');
    expect(rootElem).toHaveLength(1);

    const inputs = rootElem.find('input');
    expect(inputs).toHaveLength(2);

    const startDateInput = inputs.at(0);
    expect(startDateInput.prop('value')).toBe('');
    const endDateInput = inputs.at(1);
    expect(endDateInput.prop('value')).toBe('');
});

it('check handlers on date change', () => {
    const handlers = dashboardMockHandlers(),
        wrapper = enzymeWrapperFactory.mount(
            <DashboardFilter
                startDate={defaultStartDate}
                endDate={defaultEndDate}
                handlers={handlers}
            />
        );

    const inputs = wrapper.find('input');
    const startDateInput = inputs.at(0);
    startDateInput.simulate('change', {target: {value: moment().format(defaultDateFormat)}});
    expect(handlers.handlePeriodChange).toHaveProperty('callCount', 1);

    const endDateInput = inputs.at(1);
    endDateInput.simulate('change', {target: {value: moment().add(7, 'd').format(defaultDateFormat)}});
    expect(handlers.handlePeriodChange).toHaveProperty('callCount', 2);
});

it('check handlers on set same value', () => {
    const handlers = dashboardMockHandlers(),
        wrapper = enzymeWrapperFactory.mount(
            <DashboardFilter
                startDate={defaultStartDate}
                endDate={defaultEndDate}
                handlers={handlers}
            />
        );

    const inputs = wrapper.find('input');
    const startDateInput = inputs.at(0);
    startDateInput.simulate('change', {target: {value: defaultStartDate.format(defaultDateFormat)}});
    expect(handlers.handlePeriodChange).toHaveProperty('callCount', 0);

    const endDateInput = inputs.at(1);
    endDateInput.simulate('change', {target: {value: defaultEndDate.format(defaultDateFormat)}});
    expect(handlers.handlePeriodChange).toHaveProperty('callCount', 0);
});