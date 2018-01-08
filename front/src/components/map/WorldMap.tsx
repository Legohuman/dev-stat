import * as React from 'react';
import * as d3 from 'd3';
import WorldData from './WorldData';
import './WorldMap.css';

interface Props {
    initialScale: number;
    initialShiftX: number;
    initialShiftY: number;

    onCountryClick(country: d3.ExtendedFeature<Polygonal, any>): void;

    getCountryTooltipHtml(country: d3.ExtendedFeature<Polygonal, any>): string;
}

export type Polygonal = GeoJSON.Polygon | GeoJSON.MultiPolygon;

class WorldMap extends React.Component<Props, object> {
    private container: HTMLElement | null;
    private svgElement: SVGSVGElement | null;
    private tooltip: HTMLElement | null;

    render() {
        return (
            <div
                className="WorldMap-MapContainer"
                ref={node => this.container = node}
            >
                <svg
                    className="WorldMap-Map"
                    ref={node => this.svgElement = node}
                />
                <div
                    ref={node => this.tooltip = node}
                    className="WorldMap-Tooltip"
                />
                <div className="WorldMap-GestureHint">
                    Alt + scroll for zoom. Alt + drag to pan.
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.createWorldMap();
    }

    private createWorldMap() {
        const p = this.props,
            svgElement = d3.select(this.svgElement),
            mapWidth = this.container!!.clientWidth,
            mapHeight = this.container!!.clientHeight;

        const projection = d3.geoNaturalEarth1()
            .translate([mapWidth / 2 + p.initialShiftX, mapHeight / 2 + p.initialShiftY])
            .scale(p.initialScale);

        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .filter(() => !d3.event.button && d3.event.altKey)
            .on('zoom', onZoom);

        const pathGenerator = d3.geoPath()
            .projection(projection);

        const countriesGroup = svgElement.append('g');

        svgElement.call(zoom as d3.ZoomBehavior<any, any>);

        countriesGroup.selectAll('path')
            .data(WorldData.features)
            .enter()
            .append('path');

        countriesGroup.selectAll('path')
            .data(WorldData.features)
            .attr('class', 'WorldMap-CountryPath')
            .attr('data-country-id', feature => feature.id)
            .attr('d', feature => pathGenerator(feature as d3.ExtendedFeature<Polygonal, any>))
            .on('click', feature => {
                this.props.onCountryClick(feature as d3.ExtendedFeature<Polygonal, any>);
            })
            .on('mouseover', feature => {
                this.setEventTargetHighlighted(true);
                this.showTooltip(feature as d3.ExtendedFeature<Polygonal, any>);
            })
            .on('mouseout', () => {
                this.setEventTargetHighlighted(false);
                this.hideTooltip();
            });

        function onZoom() {
            countriesGroup.attr('transform', `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${d3.event.transform.k})`);
        }
    }

    private showTooltip(feature: d3.ExtendedFeature<Polygonal, any>) {
        const p = this.props,
            tooltip = d3.select(this.tooltip);

        tooltip.transition()
            .duration(100)
            .style('opacity', 0.75);
        tooltip.html(p.getCountryTooltipHtml(feature as d3.ExtendedFeature<Polygonal, any>))
            .style('left', (d3.event.clientX + 10) + 'px')
            .style('top', (d3.event.clientY + 10) + 'px');
    }

    private hideTooltip() {
        const tooltip = d3.select(this.tooltip);

        tooltip.transition()
            .duration(100)
            .style('opacity', 0);
    }

    private setEventTargetHighlighted(highlighted: boolean) {
        d3.select(d3.event.target)
            .classed('WorldMap-CountryPath_highlighted', highlighted);
    }
}

export default WorldMap;