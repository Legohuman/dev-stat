import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import './MessageList.css';
import { DeveloperMeasureType } from '../types/DashboardState';

export interface MeasureInfoProps {
    title: string;
    value: string;
    chartType: DeveloperMeasureType;
    selectChartHandler: (chartType: DeveloperMeasureType) => void;
}

class MeasureInfo extends React.Component<MeasureInfoProps, object> {
    render() {
        const p = this.props;

        return (
            <div>
                <span className="DashboardCountryDetail-MeasureTitle">{p.title}:&nbsp;</span>
                <span className="DashboardCountryDetail-MeasureValue">{p.value}</span>
                <Button
                    onClick={this.handleChartSelect}
                    className="DashboardCountryDetail-MeasureChartButton"
                    bsStyle="primary"
                >
                    <Glyphicon glyph="signal"/>
                </Button>
            </div>
        );
    }

    private handleChartSelect = () => {
        const p = this.props;
        p.selectChartHandler(p.chartType);
    }
}

export default MeasureInfo;
