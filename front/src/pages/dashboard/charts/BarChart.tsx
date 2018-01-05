import * as d3 from 'd3';
import * as _ from 'lodash';
import { ChartBin } from '../../../types/DashboardState';
import AbstractChart from './AbstractChart';
import { Validators } from '../../../utils/PropValidators';

const barParams = {
    strokeColor: '#666',
    fillColor: '#fe9922',
    fillOpacity: '0.6',
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
            .style('fill-opacity', barParams.fillOpacity)
            .style('stroke', barParams.strokeColor)
            .attr('x', (d, i) => this.xScale(d.x0) + barHorizontalMargin)
            .attr('y', d => this.yScale(d.height))
            .attr('height', d => this.plotHeight - this.yScale(d.height))
            .attr('width', d => this.xScale(d.x1) - this.xScale(d.x0) - barHorizontalMargin * 2);
    }

    protected validateData(): string[] {
        const p = this.props;
        const messages: (string | undefined)[] = super.validateData();

        p.data.values.forEach(bin => {
            messages.push(Validators.notNegativeNumber('bar height', bin.height));
            messages.push(Validators.positiveNumber('bar width', bin.x1 - bin.x0));
            messages.push(Validators.notNegativeNumber('bar x position', bin.x0));
        });
        return _.compact(messages);
    }
}

export default BarChart;