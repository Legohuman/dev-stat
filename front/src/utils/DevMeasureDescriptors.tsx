import * as React from 'react';
import { DataService, PeriodAndCountryRequest } from '../service/DataService';
import { DataResponse } from '../service/RestService';
import { ChartBin, ChartDataSet, ChartPoint, DeveloperMeasureType, MeanDevSummary } from '../types/DashboardState';
import MeasureInfo from '../components/MeasureInfo';

export interface DevMeasureDescriptor<T> {
    readonly chartType: DeveloperMeasureType;
    readonly chartDataRequestOperation: keyof typeof DataService;

    getMeasureTitle(): string;

    fetchChartData(request: PeriodAndCountryRequest): Promise<DataResponse<T>>;

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: () => void): React.ReactNode;
}

abstract class BaseChartDescriptor<T> implements DevMeasureDescriptor<T> {
    readonly abstract chartType: DeveloperMeasureType;
    readonly abstract chartDataRequestOperation: keyof typeof DataService;

    abstract getMeasureTitle(): string;

    abstract fetchChartData(request: PeriodAndCountryRequest): Promise<DataResponse<T>>;

    abstract renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode;
}

export class AgeChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = DeveloperMeasureType.age;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevAgeChart';

    getMeasureTitle(): string {
        return 'Mean age';
    }

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevAgeChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                value={data.age + ' years'}
                chartType={this.chartType}
                selectChartHandler={selectChartHandler}
            />
        );
    }
}

export class SalaryChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartPoint>> {
    readonly chartType = DeveloperMeasureType.salary;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevSalaryChart';

    getMeasureTitle(): string {
        return 'Mean salary';
    }

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevSalaryChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                value={data.salary + ' $/month'}
                chartType={this.chartType}
                selectChartHandler={selectChartHandler}
            />
        );
    }
}

export class ExperienceChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = DeveloperMeasureType.experience;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevExperienceChart';

    getMeasureTitle(): string {
        return 'Mean experience';
    }

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevExperienceChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                value={data.experience + ' years'}
                chartType={this.chartType}
                selectChartHandler={selectChartHandler}
            />
        );
    }
}

export class CompanySizeChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = DeveloperMeasureType.companySize;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevCompanySizeChart';

    getMeasureTitle(): string {
        return 'Mean company size';
    }

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevCompanySizeChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                value={data.companySize + ' people'}
                chartType={this.chartType}
                selectChartHandler={selectChartHandler}
            />
        );
    }

}