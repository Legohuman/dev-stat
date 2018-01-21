import * as React from 'react';
import * as Enzyme from 'enzyme';

import { DashboardCountryDetail } from '../../../pages/dashboard/DashboardCountryDetail';
import { dashboardMockHandlers } from '../../DashboardMockHandlers';
import { DeveloperMeasureType } from '../../../types/DashboardState';
import BarChart from '../../../components/charts/BarChart';
import { DashboardCountryDetailAssertFactory } from './DashboardCountryDetailAssertFactory';
import LineChart from '../../../components/charts/LineChart';

it('renders country detail with age chart', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = Enzyme.mount(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={DeveloperMeasureType.age}
            meanDev={getMeanDevInfo()}
            charts={getAgeChartsData()}
            handlers={handlers}
            operations={{}}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered();

    assertFactory.assertChart()
        .rendered(BarChart, getAgeChartsData()[DeveloperMeasureType.age]);
});

it('renders country detail with salary chart', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = Enzyme.mount(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={DeveloperMeasureType.salary}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={handlers}
            operations={{}}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered();

    assertFactory.assertChart()
        .rendered(LineChart, getSalaryChartsData()[DeveloperMeasureType.salary]);
});

it('render updated country detail with salary chart', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = Enzyme.mount(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={DeveloperMeasureType.age}
            meanDev={getMeanDevInfo()}
            charts={getAgeChartsData()}
            handlers={handlers}
            operations={{}}
        />
    );
    wrapper.setProps({
        selectedChartType: DeveloperMeasureType.salary,
        charts: getSalaryChartsData(),
        meanDev: getMeanDevInfo2()
    });
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered();

    assertFactory.assertChart()
        .rendered(LineChart, getSalaryChartsData()[DeveloperMeasureType.salary]);
});

it('renders country detail without selected country', () => {
    const wrapper = Enzyme.mount(
        <DashboardCountryDetail
            selectedCountry={undefined}
            selectedChartType={DeveloperMeasureType.salary}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
            operations={{}}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .notRendered();

    assertFactory.assertMeanDevInfo()
        .renderedAsNotAvailable();

    assertFactory.assertChart()
        .notRendered();
});

it('renders country detail without mean dev', () => {
    const wrapper = Enzyme.mount(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={DeveloperMeasureType.salary}
            meanDev={undefined}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
            operations={{}}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .renderedAsNotAvailable();

    assertFactory.assertChart()
        .notRendered();
});

it('renders country detail without selected chart', () => {
    const wrapper = Enzyme.mount(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={undefined}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
            operations={{}}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered()
        .measure(DeveloperMeasureType.age, '29')
        .measure(DeveloperMeasureType.salary, '2000')
        .measure(DeveloperMeasureType.experience, '7')
        .measure(DeveloperMeasureType.companySize, '100');

    assertFactory.assertChart()
        .notRendered();
});

function getAgeChartsData() {
    const chartsData = {};
    chartsData[DeveloperMeasureType.age] = {
        meanValue: 29,
        values: [{x0: 25, x1: 30, height: 100}]
    };
    return chartsData;
}

function getSalaryChartsData() {
    const chartsData = {};
    chartsData[DeveloperMeasureType.salary] = {
        meanValue: 2000,
        values: [
            {x: 1500, y: 0.2},
            {x: 2000, y: 0.6},
            {x: 2500, y: 0.2}
        ]
    };
    return chartsData;
}

function getSelectedCountryInfo() {
    return {id: 'RUS', name: 'Russian Federation'};
}

function getMeanDevInfo() {
    return {age: 29, salary: 2000, experience: 7, companySize: 100};
}

function getMeanDevInfo2() {
    return {age: 30, salary: 2500, experience: 8, companySize: 200};
}
