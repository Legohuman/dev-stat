import * as React from 'react';
import * as cheerio from 'cheerio';
import { ChartAssertFactory } from "./ChartAssertFactory";
import { ChartDataSet, ChartPoint } from "../../../../types/DashboardState";
import LineChart from "../../../../pages/dashboard/charts/LineChart";
import { enzymeWrapperFactory } from "../../../EnzymeWrapperFactory";

afterEach(enzymeWrapperFactory.unmount);

it('renders line chart with non-empty data', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <LineChart
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
        .hasDomainExtent(0, 3);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasDomainExtent(0, 9);
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(7)
        .hasCoordinate(980);
    chartTestHelper.assertDataLine()
        .rendered()
        .hasCoordinates('M0,440L23.333333333333332,431.8518518518519C46.666666666666664,423.7037037037037,' +
            '93.33333333333333,407.4074074074074,140,374.8148148148148C186.66666666666666,342.2222222222222,233.33333333333334,' +
            '293.3333333333333,280,228.14814814814815C326.6666666666667,162.96296296296296,373.3333333333333,81.48148148148148,' +
            '396.6666666666667,40.74074074074074L420,0');
});

it('updates line chart with non-empty data', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <LineChart
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
        .hasDomainExtent(0, 3);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasDomainExtent(0, 10);
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(6)
        .hasCoordinate(840);
    chartTestHelper.assertDataLine()
        .rendered()
        .hasCoordinates('M0,0L23.333333333333332,36.666666666666664C46.666666666666664,73.33333333333333,93.33333333333333,' +
            '146.66666666666666,140,201.66666666666666C186.66666666666666,256.6666666666667,233.33333333333334,293.3333333333333,' +
            '280,321.85999999999996C326.6666666666667,350.3866666666666,373.3333333333333,370.7733333333333,396.6666666666667,' +
            '380.96666666666664L420,391.15999999999997');
});

it('renders line chart with zero y coordinates', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <LineChart
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
        .hasDomainExtent(0, 5);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasNoDomainExtent();
    chartTestHelper.assertMeanLine()
        .notRendered();
    chartTestHelper.assertDataLine()
        .rendered()
        .hasCoordinates('M0,440L420,440');
});

it('renders line chart with no points', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <LineChart
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
    chartTestHelper.assertDataLine()
        .notRendered();
});

it('updates line chart to empty dataset (no points)', () => {
    const wrapper = enzymeWrapperFactory.mount(
        <LineChart
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
    chartTestHelper.assertDataLine()
        .notRendered();
});

const dataSet1: ChartDataSet<ChartPoint> = {
    meanValue: 7,
    values: [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 3, y: 9},
    ]
};

const dataSet2: ChartDataSet<ChartPoint> = {
    meanValue: 6,
    values: [
        {x: 0, y: 10},
        {x: 1, y: 5},
        {x: 2, y: 2.5},
        {x: 3, y: 1.11},
    ]
};

const emptyDataSet1: ChartDataSet<ChartPoint> = {
    meanValue: undefined,
    values: [
        {x: 0, y: 0},
        {x: 5, y: 0},
    ]
};

const emptyDataSet2: ChartDataSet<ChartPoint> = {
    meanValue: undefined,
    values: []
};