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

    const chartTestHelper = new ChartAssertFactory(cheerio.load(svg.html()));
    chartTestHelper.assertAxis('g.x.axis')
        .rendered()
        .hasDomainExtent(10, 30);
    chartTestHelper.assertAxis('g.y.axis')
        .rendered()
        .hasDomainExtent(0, 300);
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(15)
        .hasCoordinate(107.5);
    chartTestHelper.assertBars()
        .count(2)
        .hasBars([
            {x: 2, y: 0, height: 470, width: 211},
            {x: 217, y: 156.6667, height: 313.33333, width: 211},
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
        .hasCoordinate(165.38);
    chartTestHelper.assertBars()
        .count(3)
        .hasBars([
            {x: 2, y: 0, height: 470, width: 161.3846},
            {x: 167.3846, y: 201.4286, height: 268.5714, width: 161.3846},
            {x: 332.7692, y: 335.7142, height: 134.2857, width: 78.6923},
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
            {x: 2, y: 470, height: 0, width: 211},
            {x: 217, y: 470, height: 0, width: 211},
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
        .hasCoordinate(110.39);

    wrapper.setProps({data: {...dataSet1, meanValue: 15.1389567}});

    chartTestHelper = new ChartAssertFactory(cheerio.load(wrapper.html()));
    chartTestHelper.assertMeanLine()
        .rendered()
        .hasDomainValue(15.14)
        .hasCoordinate(110.49);
});