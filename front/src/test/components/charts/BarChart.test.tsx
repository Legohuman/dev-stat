import * as React from 'react';
import * as cheerio from 'cheerio';
import BarChart from '../../../../src/components/charts/BarChart';
import { ChartAssertFactory } from './ChartAssertFactory';
import { ChartBin, ChartDataSet } from '../../../types/DashboardState';
import { enzymeWrapperFactory } from '../../EnzymeWrapperFactory';

const dataSet1: ChartDataSet<ChartBin> = {
    meanValue: 15,
    values: [
        {x0: 10, x1: 20, height: 300},
        {x0: 20, x1: 30, height: 200}
    ]
};

const dataSet2: ChartDataSet<ChartBin> = {
    meanValue: 20,
    values: [
        {x0: 10, x1: 20, height: 350},
        {x0: 20, x1: 30, height: 200},
        {x0: 30, x1: 35, height: 100}
    ]
};

const emptyDataSet1: ChartDataSet<ChartBin> = {
    meanValue: undefined,
    values: [
        {x0: 10, x1: 20, height: 0},
        {x0: 20, x1: 30, height: 0},
    ]
};

const emptyDataSet2: ChartDataSet<ChartBin> = {
    meanValue: undefined,
    values: []
};

afterEach(enzymeWrapperFactory.unmount);

it('renders bar chart with non-empty data', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <BarChart
            width={500}
            height={500}
            data={dataSet1}
        />
    );
    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.props().width).toBe(500);
    expect(svg.props().height).toBe(500);

    const chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertAxis('g.x.axis')
        .rendered()
        .hasDomainExtent(10, 30);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasDomainExtent(0, 300);
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(15)
        .hasCoordinate(105);
    chartTestHelper.assertBars()
        .count(2)
        .hasBars([
            {x: 2, y: 0, height: 440, width: 206},
            {x: 212, y: 146.67, height: 293.33, width: 206},
        ]);
});

it('updates bar chart with non-empty data', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <BarChart
            width={500}
            height={500}
            data={dataSet1}
        />
    );
    wrapper.setProps({width: 800, height: 800, data: dataSet2});

    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.props().width).toBe(800);
    expect(svg.props().height).toBe(800);

    const chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertAxis('g.x.axis')
        .rendered()
        .hasDomainExtent(10, 36);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasDomainExtent(0, 350);
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(20)
        .hasCoordinate(161.54);
    chartTestHelper.assertBars()
        .count(3)
        .hasBars([
            {x: 2, y: 0, height: 440, width: 157.54},
            {x: 163.54, y: 188.57, height: 251.43, width: 157.54},
            {x: 325.08, y: 314.29, height: 125.71, width: 76.77},
        ]);
});

it('renders bar chart with zero values', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <BarChart
            width={500}
            height={500}
            data={emptyDataSet1}
        />
    );
    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.props().width).toBe(500);
    expect(svg.props().height).toBe(500);

    const chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertAxis('g.x.axis')
        .rendered()
        .hasDomainExtent(10, 30);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasNoDomainExtent();
    chartTestHelper.assertMeanLine()
        .notRendered();
    chartTestHelper.assertBars()
        .count(2)
        .hasBars([
            {x: 2, y: 440, height: 0, width: 206},
            {x: 212, y: 440, height: 0, width: 206},
        ]);
});

it('renders bar chart with no bars', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <BarChart
            width={500}
            height={500}
            data={emptyDataSet2}
        />
    );

    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.props().width).toBe(500);
    expect(svg.props().height).toBe(500);

    const chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertAxis('g.x.axis')
        .rendered()
        .hasNoDomainExtent();
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasNoDomainExtent();
    chartTestHelper.assertMeanLine()
        .notRendered();
    chartTestHelper.assertBars()
        .count(0);
});

it('updates bar chart to empty dataset (no bars)', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <BarChart
            width={500}
            height={500}
            data={dataSet1}
        />
    );
    wrapper.setProps({width: 800, height: 800, data: emptyDataSet2});

    const svg = wrapper.find('svg');
    expect(svg).toHaveLength(1);
    expect(svg.props().width).toBe(800);
    expect(svg.props().height).toBe(800);

    const chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertAxis('g.x.axis')
        .rendered()
        .hasNoDomainExtent();
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasNoDomainExtent();
    chartTestHelper.assertMeanLine()
        .notRendered();
    chartTestHelper.assertBars()
        .count(0);
});

it('check round of mean value', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <BarChart
            width={500}
            height={500}
            data={{...dataSet1, meanValue: 15.1345677}}
        />
    );

    let chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(15.13)
        .hasCoordinate(107.83);

    wrapper.setProps({data: {...dataSet1, meanValue: 15.1389567}});

    chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(15.14)
        .hasCoordinate(107.92);
});