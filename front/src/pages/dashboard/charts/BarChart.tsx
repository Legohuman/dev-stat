import * as React from 'react';
import * as d3 from 'd3';
import { ChartBin } from "../../../types/DashboardState";

const barHorizontalMargin = 2;
const plotMargins = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
};

interface Props {
    data: Array<ChartBin>,
    width: number,
    height: number,
}

class BarChart extends React.Component<Props, object> {
    private svgElement: SVGSVGElement | null;
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
            ref={node => this.svgElement = node}
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
        console.debug('Creating bar chart');

        this.updatePlotDimensions();
        this.prepareAxes();
        this.prepareChartGroups();

        this.updateBarChart();
    }

    updateBarChart() {
        console.debug('Updating bar chart');

        this.updateAxesScale();
        this.renderAxes();
        this.renderBars();
    }

    private prepareChartGroups() {
        this.plotGroup = d3.select(this.svgElement)
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
        const dataMaxX = d3.max(p.data, d => d.x1) || 0;
        this.xScale.domain([0, dataMaxX]).nice();

        const dataMaxY = d3.max(p.data, d => d.height) || 0;
        this.yScale.domain([0, dataMaxY]).nice();
    }

    private renderAxes() {
        this.xAxisGroup.call(this.xAxis);
        this.yAxisGroup.call(this.yAxis);
    }

    private renderBars() {
        const p = this.props;

        this.plotGroup.selectAll('rect')
            .data(p.data)
            .enter()
            .append('rect');

        this.plotGroup.selectAll('rect')
            .data(p.data)
            .exit()
            .remove();

        this.plotGroup.selectAll('rect')
            .data(p.data)
            .style('fill', '#fe9922')
            .style('stroke', '#666')
            .attr('x', (d, i) => this.xScale(d.x0) + barHorizontalMargin)
            .attr('y', d => this.plotHeight - this.yScale(d.height))
            .attr('height', d => this.yScale(d.height))
            .attr('width', d => this.xScale(d.x1 - d.x0) - barHorizontalMargin * 2);
    }
}

export default BarChart