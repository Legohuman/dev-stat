import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import './MessageList.css';
import { DeveloperMeasureType } from '../types/DashboardState';

export interface MeasureInfoProps {
    value: string;
    chartType: DeveloperMeasureType;
    selectChartHandler: (chartType: DeveloperMeasureType) => void;
}

class MeasureInfo extends React.Component<MeasureInfoProps, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardCountryDetail-MeasureValue">
                {p.value}
                <Button
                    onClick={this.handleChartSelect}
                    className="DashboardCountryDetail-ChartButton"
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
