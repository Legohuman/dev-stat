import * as React from 'react';
import './DashboardCountryDetail.css';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import {
    DashboardCountryDetailData, DashboardOperationsContainer, DashboardState,
    DeveloperMeasureType
} from '../../types/DashboardState';
import { devMeasureDescriptorSelector } from '../../utils/DevMeasureDescriptorSelector';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import { connect, Dispatch } from 'react-redux';
import { ActionsFactory } from '../../actions/ActionsFactory';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

interface DashboardCountryDetailHandlers {
    handlers: {
        handleChartChange(chartType?: DeveloperMeasureType): void
    };
}

export class DashboardCountryDetail extends React.Component<DashboardCountryDetailData & DashboardOperationsContainer & DashboardCountryDetailHandlers, object> {
    render() {
        return (
            <div className="DashboardCountryDetail">
                <Grid className="DashboardCountryDetail-ProfileInfo">
                    {this.renderSelectedInfoTitle()}
                    {this.renderMeanDevInfo()}
                </Grid>
            </div>
        );
    }

    renderSelectedInfoTitle() {
        const p = this.props;

        if (p.selectedCountry) {
            const selectedCountryName = p.selectedCountry!!.name;
            let titleText = `Developer profile in ${selectedCountryName}`;
            let backButton = undefined;

            if (this.shouldShowChartData()) {
                const measureTitle = devMeasureDescriptorSelector.get(p.selectedChartType!!).getMeasureTitle();
                titleText = `${measureTitle} developer distribution in ${selectedCountryName}`;
                backButton = this.renderBackToMeanInfoButton();
            }

            return (
                <Row>
                    <Col xs={3} sm={2} md={1}>
                        {backButton}
                    </Col>
                    <Col xs={6} sm={8} md={10}>
                        <div className="DashboardCountryDetail-ProfileTitle">{titleText}</div>
                    </Col>
                    <Col xs={3} sm={2} md={1}/>
                </Row>
            );
        }
        return undefined;
    }

    renderBackToMeanInfoButton() {
        return (
            <Button
                onClick={this.handleBackToMeanInfoClick}
                className="DashboardCountryDetail-BackButton"
                bsStyle="link"
            >
                <Glyphicon glyph="chevron-left"/>&nbsp;Back
            </Button>
        );
    }

    renderMeanDevInfo(): React.ReactNode {
        const p = this.props;

        if (p.selectedCountry && p.meanDev) {
            if (this.shouldShowChartData()) {
                return this.renderSelectedChart();
            } else {
                return this.renderDevMeasures();
            }
        } else {
            return <div className="DashboardCountryDetail-ProfileInfo_notAvailable">No data available</div>;
        }
    }

    shouldShowChartData() {
        const p = this.props;
        return p.selectedCountry && p.selectedChartType && p.charts[p.selectedChartType];
    }

    renderDevMeasures(): React.ReactNode {
        const p = this.props;

        const rowNodes: Array<React.ReactNode> = [];
        let colNodes: Array<React.ReactNode> = [];
        devMeasureDescriptorSelector.list().forEach((descriptor, i) => {
            const titleColNode = (
                <Col
                    key={'ct' + i}
                    className="DashboardCountryDetail-MeasureTitleCol"
                    xs={6}
                    sm={3}
                >
                    {descriptor.getMeasureTitle()}:
                </Col>
            );
            colNodes.push(titleColNode);

            const valueColNode = (
                <Col
                    key={'cv' + i}
                    data-measure-type={descriptor.chartType}
                    className="DashboardCountryDetail-MeasureValueCol"
                    xs={6}
                    sm={3}
                >
                    {descriptor.renderMeasureInfo(p.meanDev!!, p.handlers.handleChartChange)}
                </Col>
            );
            colNodes.push(valueColNode);

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

        if (p.selectedCountry && p.meanDev && p.selectedChartType) {
            if (p.selectedChartType === DeveloperMeasureType.salary) {
                return <LineChart data={p.charts[p.selectedChartType]}/>;
            } else {
                return <BarChart data={p.charts[p.selectedChartType]}/>;
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

    private handleBackToMeanInfoClick = () => {
        this.props.handlers.handleChartChange(undefined);
    }
}

function mapStateToProps({countryDetail, operations}: DashboardState) {
    return {...countryDetail, operations};
}

function createDashboardPageHandlers(dispatch: Dispatch<DashboardState &
    DashboardCountryDetailHandlers>): DashboardCountryDetailHandlers {
    return {
        handlers: {
            handleChartChange(chartType?: DeveloperMeasureType): void {
                dispatch(ActionsFactory.handleChartChange(chartType));
            }
        }
    };
}

export const DashboardCountryDetailContainer = connect(mapStateToProps, createDashboardPageHandlers)(DashboardCountryDetail);
