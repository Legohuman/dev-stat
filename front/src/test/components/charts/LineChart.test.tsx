import * as React from 'react';
import * as cheerio from 'cheerio';
import { ChartAssertFactory } from "./ChartAssertFactory";
import { ChartDataSet, ChartPoint } from "../../../types/DashboardState";
import LineChart from "../../../components/charts/LineChart";
import { enzymeWrapperFactory } from "../../EnzymeWrapperFactory";

const dataSet1: ChartDataSet<ChartPoint> = {
    meanValue: 7,
    values: [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 3, y: 8},
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
        .hasDomainExtent(0, 8);
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(7)
        .hasCoordinate(1003.33);
    chartTestHelper.assertDataLine()
        .rendered()
        .hasCoordinates('M0,470L23.888888888888886,460.2083333333333C47.77777777777777,450.4166666666667,' +
            '95.55555555555554,430.8333333333333,143.33333333333331,391.6666666666667C191.1111111111111,352.5,' +
            '238.88888888888883,293.75,286.66666666666663,225.20833333333334C334.4444444444444,156.66666666666666,' +
            '382.2222222222222,78.33333333333333,406.1111111111111,39.166666666666664L430,0');
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
        .hasCoordinate(860);
    chartTestHelper.assertDataLine()
        .rendered()
        .hasCoordinates('M0,0L23.888888888888886,39.166666666666664C47.77777777777777,78.33333333333333,' +
            '95.55555555555554,156.66666666666666,143.33333333333331,215.41666666666666C191.1111111111111,274.1666666666667,' +
            '238.88888888888883,313.3333333333333,286.66666666666663,343.805C334.4444444444444,374.27666666666664,382.2222222222222,' +
            '396.0533333333333,406.1111111111111,406.94166666666666L430,417.83');
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
        .hasCoordinates('M0,470L430,470');
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