import * as d3 from 'd3';
import { ChartBin } from '../../../types/DashboardState';
import AbstractChart from './AbstractChart';

const barParams = {
    strokeColor: '#666',
    fillColor: '#fe9922',
};

const barHorizontalMargin = 2;

class BarChart extends AbstractChart<ChartBin> {

    protected updateAxesScale() {
        const p = this.props;
        const dataMinX = d3.min(p.data.values, d => d.x0) || 0;
        const dataMaxX = d3.max(p.data.values, d => d.x1) || 0;
        this.xScale.domain([dataMinX, dataMaxX]).nice();

        const dataMaxY = d3.max(p.data.values, d => d.height) || 0;
        this.yScale.domain([0, dataMaxY]).nice();
    }

    protected renderData() {
        const p = this.props;

        this.plotGroup.selectAll('rect')
            .data(p.data.values)
            .enter()
            .append('rect');

        this.plotGroup.selectAll('rect')
            .data(p.data.values)
            .exit()
            .remove();

        this.plotGroup.selectAll('rect')
            .data(p.data.values)
            .style('fill', barParams.fillColor)
            .style('stroke', barParams.strokeColor)
            .attr('x', (d, i) => this.xScale(d.x0) + barHorizontalMargin)
            .attr('y', d => this.yScale(d.height))
            .attr('height', d => this.plotHeight - this.yScale(d.height))
            .attr('width', d => this.xScale(d.x1) - this.xScale(d.x0) - barHorizontalMargin * 2);
    }
}

export default BarChart;