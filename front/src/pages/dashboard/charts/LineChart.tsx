import * as React from 'react';
import * as d3 from 'd3';
import { ChartPoint } from "../../../types/DashboardState";

const plotMargins = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
};

interface Props {
    data: Array<ChartPoint>,
    width: number,
    height: number,
}

class BarChart extends React.Component<Props, object> {
    private node: SVGSVGElement | null;
    private plotGroup: d3.Selection<any, any, null, undefined>;
    private xAxisGroup: d3.Selection<any, any, null, undefined>;
    private yAxisGroup: d3.Selection<any, any, null, undefined>;

    private xAxis: d3.Axis<any>;
    private yAxis: d3.Axis<any>;
    private xScale: d3.ScaleLinear<number, number>;
    private yScale: d3.ScaleLinear<number, number>;

    private plotWidth: number;
    private plotHeight: number;

    render() {
        const p = this.props;

        return <svg
            ref={node => this.node = node}
            width={p.width}
            height={p.height}>
        </svg>
    }

    componentDidMount() {
        this.createBarChart();
    }

    componentDidUpdate() {
        this.updateBarChart();
    }

    createBarChart() {
        console.debug('Creating line chart');

        this.updatePlotDimensions();
        this.prepareAxes();
        this.prepareChartGroups();

        this.updateBarChart();
    }

    updateBarChart() {
        console.debug('Updating line chart');

        this.updateAxesScale();
        this.renderAxes();
        this.renderLine();
    }

    private prepareChartGroups() {
        this.plotGroup = d3.select(this.node)
            .append('g')
            .classed('plot', true)
            .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

        this.xAxisGroup = this.plotGroup.append('g')
            .classed('x', true)
            .classed('axis', true)
            .attr('transform', `translate(${0},${this.plotHeight})`);

        this.yAxisGroup = this.plotGroup.append('g')
            .classed('y', true)
            .classed('axis', true);
    }

    private prepareAxes() {
        this.xScale = d3.scaleLinear()
            .range([0, this.plotWidth]);
        this.xAxis = d3.axisBottom(this.xScale);

        this.yScale = d3.scaleLinear()
            .range([this.plotHeight, 0]);
        this.yAxis = d3.axisLeft(this.yScale);
    }

    private updatePlotDimensions() {
        const p = this.props;

        this.plotWidth = p.width - plotMargins.left - plotMargins.right;
        this.plotHeight = p.height - plotMargins.top - plotMargins.bottom;
    }

    private updateAxesScale() {
        const p = this.props;
        const dataMaxX = d3.max(p.data, d => d.x) || 0;
        this.xScale.domain([0, dataMaxX]).nice();

        const dataMaxY = d3.max(p.data, d => d.y) || 0;
        this.yScale.domain([0, dataMaxY]).nice();
    }

    private renderAxes() {
        this.xAxisGroup.call(this.xAxis);
        this.yAxisGroup.call(this.yAxis);
    }

    private renderLine() {
        const p = this.props;

        this.plotGroup.selectAll("path")
            .remove();

        this.plotGroup.append("path")
            .datum(p.data)
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line<ChartPoint>()
                .curve(d3.curveBasis)
                .x(d => this.xScale(d.x))
                .y(d => this.yScale(d.y)));
    }
}

export default BarChart