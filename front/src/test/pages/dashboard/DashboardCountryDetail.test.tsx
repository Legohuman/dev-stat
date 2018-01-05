import * as React from 'react';
import * as Enzyme from 'enzyme';

import DashboardCountryDetail from '../../../pages/dashboard/DashboardCountryDetail';
import { dashboardMockHandlers } from '../../DashboardMockHandlers';
import { ChartType } from '../../../types/DashboardState';
import BarChart from '../../../pages/dashboard/charts/BarChart';
import { DashboardCountryDetailAssertFactory } from './DashboardCountryDetailAssertFactory';
import LineChart from '../../../pages/dashboard/charts/LineChart';

it('renders country detail with age chart', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={ChartType.age}
            meanDev={getMeanDevInfo()}
            charts={getAgeChartsData()}
            handlers={handlers}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered()
        .measure(ChartType.age, '29')
        .measure(ChartType.salary, '2000')
        .measure(ChartType.experience, '7')
        .measure(ChartType.companySize, '100')
        .chartSelectionsHandled(Object.keys(ChartType).map(k => ChartType[k]), handlers.handleChartChange);

    assertFactory.assertChart()
        .rendered(BarChart, getAgeChartsData()[ChartType.age])
});

it('renders country detail with salary chart', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={ChartType.salary}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={handlers}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered()
        .measure(ChartType.age, '29')
        .measure(ChartType.salary, '2000')
        .measure(ChartType.experience, '7')
        .measure(ChartType.companySize, '100')
        .chartSelectionsHandled(Object.keys(ChartType).map(k => ChartType[k]), handlers.handleChartChange);

    assertFactory.assertChart()
        .rendered(LineChart, getSalaryChartsData()[ChartType.salary])
});

it('render updated country detail with salary chart', () => {
    const handlers = dashboardMockHandlers();
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={ChartType.age}
            meanDev={getMeanDevInfo()}
            charts={getAgeChartsData()}
            handlers={handlers}
        />
    );
    wrapper.setProps({
        selectedChartType: ChartType.salary,
        charts: getSalaryChartsData(),
        meanDev: getMeanDevInfo2()
    });
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered()
        .measure(ChartType.age, '30')
        .measure(ChartType.salary, '2500')
        .measure(ChartType.experience, '8')
        .measure(ChartType.companySize, '200')
        .chartSelectionsHandled(Object.keys(ChartType).map(k => ChartType[k]), handlers.handleChartChange);

    assertFactory.assertChart()
        .rendered(LineChart, getSalaryChartsData()[ChartType.salary])
});

it('renders country detail without selected country', () => {
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={undefined}
            selectedChartType={ChartType.salary}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
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
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={ChartType.salary}
            meanDev={undefined}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
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
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={undefined}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered()
        .measure(ChartType.age, '29')
        .measure(ChartType.salary, '2000')
        .measure(ChartType.experience, '7')
        .measure(ChartType.companySize, '100');

    assertFactory.assertChart()
        .notRendered();
});

it('renders country detail without selected chart', () => {
    const wrapper = Enzyme.shallow(
        <DashboardCountryDetail
            selectedCountry={getSelectedCountryInfo()}
            selectedChartType={undefined}
            meanDev={getMeanDevInfo()}
            charts={getSalaryChartsData()}
            handlers={dashboardMockHandlers()}
        />
    );
    const assertFactory = new DashboardCountryDetailAssertFactory(wrapper);

    assertFactory.assertProfileTitle()
        .rendered()
        .hasText('Russian Federation');

    assertFactory.assertMeanDevInfo()
        .rendered()
        .measure(ChartType.age, '29')
        .measure(ChartType.salary, '2000')
        .measure(ChartType.experience, '7')
        .measure(ChartType.companySize, '100');

    assertFactory.assertChart()
        .notRendered();
});

function getAgeChartsData() {
    const chartsData = {};
    chartsData[ChartType.age] = {
        meanValue: 29,
        values: [{x0: 25, x1: 30, height: 100}]
    };
    return chartsData;
}

function getSalaryChartsData() {
    const chartsData = {};
    chartsData[ChartType.salary] = {
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
