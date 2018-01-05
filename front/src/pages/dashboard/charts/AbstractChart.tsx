import * as React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';
import MessageList from '../../../components/MessageList';
import { ChartDataSet } from '../../../types/DashboardState';
import { Validators } from "../../../utils/PropValidators";

const plotMargins = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
};

const meanLineParams = {
    width: 1,
    color: 'red',
    textFonFamily: 'sans-serif',
    textFonSize: '14px',
    textShiftX: 5,
    textShiftY: 15,
};

export interface ChartProps<T> {
    data: ChartDataSet<T>;
    width: number;
    height: number;
}

abstract class AbstractChart<T> extends React.Component<ChartProps<T>, object> {
    protected svgElement: SVGSVGElement | null;
    protected plotGroup: d3.Selection<any, any, null, undefined>;
    protected xAxisGroup: d3.Selection<any, any, null, undefined>;
    protected yAxisGroup: d3.Selection<any, any, null, undefined>;

    protected xAxis: d3.Axis<any>;
    protected yAxis: d3.Axis<any>;
    protected xScale: d3.ScaleLinear<number, number>;
    protected yScale: d3.ScaleLinear<number, number>;

    protected plotWidth: number;
    protected plotHeight: number;

    protected abstract updateAxesScale(): void;

    protected abstract renderData(): void;

    render() {
        const p = this.props;

        const errorMessages = this.validateData();
        if (errorMessages.length === 0) {
            return (
                <svg
                    ref={node => this.svgElement = node}
                    width={p.width}
                    height={p.height}
                />
            );
        } else {
            return <MessageList messages={errorMessages}/>
        }

    }

    protected validateData(): string[] {
        const p = this.props;

        return _.compact([
            Validators.positiveNumber('width', p.width),
            Validators.positiveNumber('height', p.height),
            Validators.positiveNumber('mean value', p.data.meanValue),
        ])
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    createChart() {
        this.updatePlotDimensions();
        this.prepareAxes();
        this.prepareChartGroups();

        this.updateChart();
    }

    updateChart() {
        this.updateAxesScale();
        this.renderAxes();
        this.renderData();
        this.renderMeanLine();
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

    private renderAxes() {
        this.xAxisGroup.call(this.xAxis);
        this.yAxisGroup.call(this.yAxis);
    }

    private renderMeanLine() {
        const p = this.props,
            meanValue = p.data.meanValue;

        this.plotGroup.selectAll('line[data-type="mean-line"]')
            .remove();
        this.plotGroup.selectAll('text[data-type="mean-line"]')
            .remove();

        if (meanValue) {
            this.plotGroup.append('line')
                .attr('data-type', 'mean-line')
                .attr('x1', this.xScale(meanValue))
                .attr('y1', 0)
                .attr('x2', this.xScale(meanValue))
                .attr('y2', this.plotHeight)
                .style('stroke-width', meanLineParams.width)
                .style('stroke', meanLineParams.color)
                .style('fill', 'none');

            this.plotGroup.append('text')
                .attr('data-type', 'mean-line')
                .attr('x', this.xScale(meanValue) + meanLineParams.textShiftX)
                .attr('y', meanLineParams.textShiftY)
                .style('font-family', meanLineParams.textFonFamily)
                .style('font-size', meanLineParams.textFonSize)
                .style('fill', meanLineParams.color)
                .text(meanValue);
        }
    }
}

export default AbstractChart;