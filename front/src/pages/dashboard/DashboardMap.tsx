import * as React from 'react';
import './DashboardMap.css';
import { CountryInfo, DashboardMapData, DashboardState } from '../../types/DashboardState';
import WorldMap, { Polygonal } from '../../components/map/WorldMap';
import ConversionUtils from '../../utils/ConversionUtils';
import Renderers from '../../utils/Renderers';
import { connect, Dispatch } from 'react-redux';
import { ActionsFactory } from '../../actions/ActionsFactory';

interface DashboardMapHandlers {
    handlers: {
        handleCountryChange(country?: CountryInfo): void
    };
}

export class DashboardMap extends React.Component<DashboardMapData & DashboardMapHandlers, object> {
    render() {
        return (
            <div className="DashboardMap">
                <WorldMap
                    initialScale={160}
                    initialShiftX={0}
                    initialShiftY={40}
                    onCountryClick={this.onCountryClick}
                    getCountryTooltipHtml={this.getCountryTooltipHtml}
                />
            </div>
        );
    }

    private onCountryClick = (country: d3.ExtendedFeature<Polygonal, any>) => {
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

    private getCountryTooltipHtml = (country: d3.ExtendedFeature<Polygonal, any>): string => {
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

function mapStateToProps(state: DashboardState) {
    return state.map;
}

function createDashboardMapHandlers(dispatch: Dispatch<DashboardState &
    DashboardMapHandlers>): DashboardMapHandlers {
    return {
        handlers: {
            handleCountryChange(country?: CountryInfo): void {
                dispatch(ActionsFactory.handleCountryChange(country));
            }
        }
    };
}

export const DashboardMapContainer = connect(mapStateToProps, createDashboardMapHandlers)(DashboardMap);