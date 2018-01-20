import * as React from 'react';
import { DataService, PeriodAndCountryRequest } from '../service/DataService';
import { DataResponse } from '../service/RestService';
import { ChartBin, ChartDataSet, ChartPoint, DeveloperMeasureType, MeanDevSummary } from '../types/DashboardState';
import MeasureInfo from '../components/MeasureInfo';

export interface DevMeasureDescriptor<T> {
    readonly chartType: DeveloperMeasureType;
    readonly chartDataRequestOperation: keyof typeof DataService;

    fetchChartData(request: PeriodAndCountryRequest): Promise<DataResponse<T>>;

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: () => void): React.ReactNode;
}

abstract class BaseChartDescriptor<T> implements DevMeasureDescriptor<T> {
    readonly abstract chartType: DeveloperMeasureType;
    readonly abstract chartDataRequestOperation: keyof typeof DataService;

    abstract fetchChartData(request: PeriodAndCountryRequest): Promise<DataResponse<T>>;

    abstract renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode;
}

export class AgeChartDescriptor extends BaseChartDescriptor<ChartDataSet<ChartBin>> {
    readonly chartType = DeveloperMeasureType.age;
    readonly chartDataRequestOperation: keyof typeof DataService = 'getDevAgeChart';

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevAgeChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                title="Mean age"
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

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevSalaryChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                title="Mean salary"
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

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevExperienceChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                title="Mean experience"
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

    fetchChartData(request: PeriodAndCountryRequest) {
        return DataService.getDevCompanySizeChart(request);
    }

    renderMeasureInfo(data: MeanDevSummary, selectChartHandler: (chartType: DeveloperMeasureType) => void): React.ReactNode {
        return (
            <MeasureInfo
                title="Mean company size"
                value={data.companySize + ' people'}
                chartType={this.chartType}
                selectChartHandler={selectChartHandler}
            />
        );
    }

}