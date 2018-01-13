import { ChartValuesType, DeveloperMeasureType } from '../types/DashboardState';
import {
    AgeChartDescriptor, CompanySizeChartDescriptor, DevMeasureDescriptor, ExperienceChartDescriptor,
    SalaryChartDescriptor
} from './DevMeasureDescriptors';

class DevMeasureDescriptorSelector {
    private readonly descriptors: {
        [chartType: string]: DevMeasureDescriptor<ChartValuesType>;
    } = {};

    constructor() {
        this.add(DeveloperMeasureType.age, new AgeChartDescriptor())
            .add(DeveloperMeasureType.salary, new SalaryChartDescriptor())
            .add(DeveloperMeasureType.experience, new ExperienceChartDescriptor())
            .add(DeveloperMeasureType.companySize, new CompanySizeChartDescriptor());
    }

    get(chartType: DeveloperMeasureType): DevMeasureDescriptor<ChartValuesType> {
        const descriptor = this.descriptors[chartType];
        if (descriptor) {
            return descriptor;
        }
        throw `Unable to find descriptor for type ${chartType}`;
    }

    list(): Array<DevMeasureDescriptor<ChartValuesType>> {
        return Object.keys(this.descriptors).map(k => this.descriptors[k]);
    }

    private add(chartType: DeveloperMeasureType, descriptor: DevMeasureDescriptor<ChartValuesType>): this {
        this.descriptors[chartType.toString()] = descriptor;
        return this;
    }
}

export const devMeasureDescriptorSelector = new DevMeasureDescriptorSelector();