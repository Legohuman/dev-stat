import * as React from 'react';
import './DashboardCountryDetail.css';
import { Col, Grid, Row } from 'react-bootstrap';
import { ChartType, DashboardCountryDetailData, DashboardOperationsContainer } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';
import { devMeasureDescriptorSelector } from '../../utils/DevMeasureDescriptorSelector';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';

class DashboardCountryDetail extends React.Component<DashboardCountryDetailData & DashboardOperationsContainer & DashboardPageHandlers, object> {
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

        if (p.selectedCountry && p.meanDev) {
            return (
                <Grid className="DashboardCountryDetail-ProfileInfo">
                    {this.renderDevMeasures()}
                </Grid>
            );
        } else {
            return <div className="DashboardCountryDetail-ProfileInfo_notAvailable">No data available</div>;
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
                    data-measure-type={descriptor.chartType}
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

        if (p.selectedCountry && p.meanDev) {
            if (p.selectedChartType && p.charts[p.selectedChartType]) {
                if (p.selectedChartType === ChartType.salary) {
                    return <LineChart width={500} height={500} data={p.charts[p.selectedChartType]}/>;
                } else {
                    return <BarChart width={500} height={500} data={p.charts[p.selectedChartType]}/>;
                }
            } else {
                return (
                    <div className="DashboardCountryDetail-ChartPlaceholder">
                        {this.renderChartPlaceholderText()}
                    </div>);
            }
        }
        return undefined;
    }

    renderChartPlaceholderText() {
        const p = this.props;

        if (!p.selectedChartType) {
            return 'Click one of chart buttons to see distribution chart.';
        } else if (p.operations[devMeasureDescriptorSelector.get(p.selectedChartType)!!.chartDataRequestOperation]) {
            return 'Loading...';
        } else {
            return 'No data available.';
        }
    }
}

export default DashboardCountryDetail;
