import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { DataService, PeriodAndCountryRequest } from '../service/DataService';
import { DataResponse } from '../service/RestService';
import { ChartBin, ChartDataSet, ChartPoint, ChartType, MeanDevSummary } from '../types/DashboardState';

export interface DevMeasureDescriptor<T> {
    readonly chartType: ChartType;
    readonly chartDataRequestOperation: keyof typeof DataService;

    fetchChartData(request: PeriodAndCountryRequest): Promise<DataResponse<T>>;

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: ChartType) => void): React.ReactNode;
}

abstract class BaseChartDescriptor<T> implements DevMeasureDescriptor<T> {
    readonly abstract chartType: ChartType;
    readonly abstract chartDataRequestOperation: keyof typeof DataService;

    abstract fetchChartData(request: PeriodAndCountryRequest): Promise<DataResponse<T>>;

    abstract renderMeanValue(data: MeanDevSummary): React.ReactNode;

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: ChartType) => void): React.ReactNode {
        return (
            <div>
                {this.renderMeanValue(data)}
                <Button
                    onClick={() => selectChartHandler(this.chartType)}
                    className="DashboardCountryDetail-MeasureChartButton"
                    bsStyle="primary"
                >
                    <Glyphicon glyph="signal"/>
                </Button>
            </div>
        );
    }
}

export class AgeChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = ChartType.age;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevAgeChart';

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevAgeChart(request);
    }

    renderMeanValue(data: MeanDevSummary): React.ReactNode {
        return (
            <React.Fragment>
                <span className="DashboardCountryDetail-MeasureTitle">Mean age:&nbsp;</span>
                <span className="DashboardCountryDetail-MeasureValue">{data.age} years</span>
            </React.Fragment>
        );
    }
}

export class SalaryChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartPoint>> {
    readonly chartType = ChartType.salary;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevSalaryChart';

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevSalaryChart(request);
    }

    renderMeanValue(data: MeanDevSummary): React.ReactNode {
        return (
            <React.Fragment>
                <span className="DashboardCountryDetail-MeasureTitle">Mean salary:&nbsp;</span>
                <span className="DashboardCountryDetail-MeasureValue">{data.salary} $/month</span>
            </React.Fragment>
        );
    }
}

export class ExperienceChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = ChartType.experience;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevExperienceChart';

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevExperienceChart(request);
    }

    renderMeanValue(data: MeanDevSummary): React.ReactNode {
        return (
            <React.Fragment>
                <span className="DashboardCountryDetail-MeasureTitle">Mean experience:&nbsp;</span>
                <span className="DashboardCountryDetail-MeasureValue">{data.experience} years</span>
            </React.Fragment>
        );
    }
}

export class CompanySizeChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = ChartType.companySize;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevCompanySizeChart';

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevCompanySizeChart(request);
    }

    renderMeanValue(data: MeanDevSummary): React.ReactNode {
        return (
            <React.Fragment>
                <span className="DashboardCountryDetail-MeasureTitle">Mean company size:&nbsp;</span>
                <span className="DashboardCountryDetail-MeasureValue">{data.companySize} people</span>
            </React.Fragment>
        );
    }
}