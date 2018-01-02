import * as d3 from 'd3';
import { ChartPoint } from '../../../types/DashboardState';
import AbstractChart from './AbstractChart';

const dataLineParams = {
    width: 1.5,
    color: 'black',
    lineJoin: 'round',
};

class LineChart extends AbstractChart<ChartPoint> {

    protected updateAxesScale() {
        const p = this.props;
        const dataMinX = d3.min(p.data.values, d => d.x) || 0;
        const dataMaxX = d3.max(p.data.values, d => d.x) || 0;
        this.xScale.domain([dataMinX, dataMaxX]).nice();

        const dataMaxY = d3.max(p.data.values, d => d.y) || 0;
        this.yScale.domain([0, dataMaxY]).nice();
    }

    protected renderData() {
        const p = this.props;

        this.plotGroup.selectAll('path[data-type=data-line]')
            .remove();

        this.plotGroup.append('path')
            .datum(p.data.values)
            .attr('data-type', 'data-line')
            .attr('fill', 'none')
            .attr('stroke', dataLineParams.color)
            .attr('stroke-width', dataLineParams.width)
            .attr('stroke-linejoin', dataLineParams.lineJoin)
            .attr('d', d3.line<ChartPoint>()
                .curve(d3.curveBasis)
                .x(d => this.xScale(d.x))
                .y(d => this.yScale(d.y)));
    }
}

export default LineChart;