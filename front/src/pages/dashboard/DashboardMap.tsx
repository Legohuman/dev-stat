import * as React from 'react';
import './DashboardMap.css';
import { DashboardMapData } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';
import WorldMap, { Polygonal } from '../../components/map/WorldMap';
import ConversionUtils from '../../utils/ConversionUtils';
import Renderers from '../../utils/Renderers';

class DashboardMap extends React.Component<DashboardMapData & DashboardPageHandlers, object> {
    render() {

        return (
            <div className="DashboardMap">
                <WorldMap
                    initialScale={210}
                    initialShiftX={0}
                    initialShiftY={40}
                    onCountryClick={country => this.onCountryClick(country)}
                    getCountryTooltipHtml={country => this.getCountryTooltipHtml(country)}
                />
            </div>
        );
    }

    private onCountryClick(country: d3.ExtendedFeature<Polygonal, any>) {
        const p = this.props,
            countryId = ConversionUtils.toStringOrUndefined(country.id);

        let countryInfo = undefined;
        if (countryId) {
            countryInfo = {
                id: countryId,
                name: country.properties.name || countryId
            };
        }

        p.handlers.handleCountryChange(countryInfo);
    }

    private getCountryTooltipHtml(country: d3.ExtendedFeature<Polygonal, any>): string {
        const p = this.props,
            countryId = country.id as string,
            countrySummary = p.countries[countryId];

        let tooltipHtml = '';
        if (countrySummary != null) {
            tooltipHtml = `<br/>Devs #:  ${Renderers.numberWithCountSuffix(countrySummary.developersCount)}
                <br/>Jobs #:  ${Renderers.numberWithCountSuffix(countrySummary.vacancyCount)}
                <br/>Economy:  ${Renderers.economyLevel(countrySummary.economyLevel)}`;
        }
        return country.properties.name + tooltipHtml;
    }

}

export default DashboardMap;
