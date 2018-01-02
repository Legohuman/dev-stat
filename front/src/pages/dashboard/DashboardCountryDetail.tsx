import * as React from 'react';
import './DashboardCountryDetail.css';
import { Col, Grid, Row } from 'react-bootstrap';
import { ChartType, DashboardCountryDetailData } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';
import { devMeasureDescriptorSelector } from '../../utils/DevMeasureDescriptorSelector';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';

class DashboardCountryDetail extends React.Component<DashboardCountryDetailData & DashboardPageHandlers, object> {
    render() {
        return (
            <div className="DashboardCountryDetail">
                {this.renderSelectedCountry()}
                {this.renderMeanDevInfo()}
                {this.renderSelectedChart()}
            </div>
        );
    }

    renderSelectedCountry() {
        const p = this.props;

        if (p.selectedCountry) {
            return (
                <div className="DashboardCountryDetail-ProfileTitle">
                    Developer profile in {p.selectedCountry.name}
                </div>
            );
        }
        return undefined;
    }

    renderMeanDevInfo(): React.ReactNode {
        const p = this.props;

        if (p.meanDev) {
            return (
                <Grid className="DashboardCountryDetail-ProfileInfo">
                    {this.renderDevMeasures()}
                </Grid>
            );
        } else {
            return <div>No data available</div>;
        }
    }

    renderDevMeasures(): React.ReactNode {
        const p = this.props;

        const rowNodes: Array<React.ReactNode> = [];
        let colNodes: Array<React.ReactNode> = [];
        devMeasureDescriptorSelector.list().forEach((descriptor, i) => {
            const colNode = (
                <Col
                    key={'c' + i}
                    className="DashboardCountryDetail-MeasureInfo"
                    sm={6}
                >
                    {descriptor.renderMeasureInfo(p.meanDev!!, p.handlers.handleChartChange)}
                </Col>
            );
            colNodes.push(colNode);

            if ((i + 1) % 2 === 0) {
                const rowNode = <Row key={'r' + i}>{colNodes}</Row>;
                rowNodes.push(rowNode);
                colNodes = [];
            }
        });
        return rowNodes;
    }

    renderSelectedChart(): React.ReactNode {
        const p = this.props;

        if (p.selectedChartType && p.charts[p.selectedChartType]) {
            if (p.selectedChartType === ChartType.salary) {
                return <LineChart width={500} height={500} data={p.charts[p.selectedChartType]}/>;
            } else {
                return <BarChart width={500} height={500} data={p.charts[p.selectedChartType]}/>;
            }
        }
        return undefined;
    }
}

export default DashboardCountryDetail;
