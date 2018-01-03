import * as React from 'react';
import * as Enzyme from 'enzyme';
import BarChart from '../../../../../src/pages/dashboard/charts/BarChart';

it('renders bar chart with correct non-empty data', () => {
    const wrapper = Enzyme.mount(
        <BarChart
            width={500}
            height={500}
            data={{
                meanValue: 15,
                values: [
                    {x0: 10, x1: 20, height: 300},
                    {x0: 20, x1: 30, height: 200}
                ]
            }}
        />
    );
    const svg = wrapper.find('svg');

    expect(svg).toHaveLength(1);
    expect(svg.props().width).toBe(500);
    expect(svg.props().width).toBe(500);
});
