import { ChartDataType, ChartType } from '../types/DashboardState';
import {
    AgeChartDescriptor, CompanySizeChartDescriptor, DevMeasureDescriptor, ExperienceChartDescriptor,
    SalaryChartDescriptor
} from './DevMeasureDescriptors';

class DevMeasureDescriptorSelector {
    private readonly descriptors: {
        [chartType: string]: DevMeasureDescriptor<ChartDataType>;
    } = {};

    constructor() {
        this.add(ChartType.age, new AgeChartDescriptor())
            .add(ChartType.salary, new SalaryChartDescriptor())
            .add(ChartType.experience, new ExperienceChartDescriptor())
            .add(ChartType.companySize, new CompanySizeChartDescriptor());
    }

    get(chartType: ChartType): DevMeasureDescriptor<ChartDataType> {
        const descriptor = this.descriptors[chartType];
        if (descriptor) {
            return descriptor;
        }
        throw `Unable to find descriptor for type ${chartType}`;
    }

    list(): Array<DevMeasureDescriptor<ChartDataType>> {
        return Object.keys(this.descriptors).map(k => this.descriptors[k]);
    }

    private add(chartType: ChartType, descriptor: DevMeasureDescriptor<ChartDataType>): this {
        this.descriptors[chartType.toString()] = descriptor;
        return this;
    }
}

export const devMeasureDescriptorSelector = new DevMeasureDescriptorSelector();