import * as Enzyme from 'enzyme';
import * as sinon from 'sinon';
import { ChartsData, ChartType } from '../../../types/DashboardState';
import { ChartProps } from '../../../pages/dashboard/charts/AbstractChart';
import BarChart from '../../../pages/dashboard/charts/BarChart';
import LineChart from '../../../pages/dashboard/charts/LineChart';

export class DashboardCountryDetailAssertFactory {
    private wrapper: Enzyme.ShallowWrapper;

    constructor(wrapper: Enzyme.ShallowWrapper) {
        this.wrapper = wrapper;
    }

    assertProfileTitle(): ProfileTitleAssert {
        return new ProfileTitleAssert(this.wrapper);
    }

    assertMeanDevInfo(): MeanDevInfoAssert {
        return new MeanDevInfoAssert(this.wrapper);
    }

    assertChart(): ShallowChartAssert {
        return new ShallowChartAssert(this.wrapper);
    }
}

class ProfileTitleAssert {
    private profileTitle: Enzyme.ShallowWrapper;

    constructor(wrapper: Enzyme.ShallowWrapper) {
        this.profileTitle = wrapper.find('.DashboardCountryDetail-ProfileTitle')
    }

    rendered(): this {
        expect(this.profileTitle.length).toBe(1);
        return this;
    }

    notRendered(): this {
        expect(this.profileTitle.length).toBe(0);
        return this;
    }

    hasText(expectedText: string): this {
        expect(this.profileTitle.text()).toContain(expectedText);
        return this;
    }
}

class MeanDevInfoAssert {
    private wrapper: Enzyme.ShallowWrapper;

    constructor(wrapper: Enzyme.ShallowWrapper) {
        this.wrapper = wrapper;
    }

    rendered(): this {
        expect(this.wrapper.find('.DashboardCountryDetail-ProfileInfo').length).toBe(1);
        expect(this.wrapper.find('.DashboardCountryDetail-ProfileInfo_notAvailable').length).toBe(0);
        return this;
    }

    renderedAsNotAvailable(): this {
        expect(this.wrapper.find('.DashboardCountryDetail-ProfileInfo').length).toBe(0);
        expect(this.wrapper.find('.DashboardCountryDetail-ProfileInfo_notAvailable').length).toBe(1);
        return this;
    }

    measure(type: ChartType, expectedValue: string): this {
        const measureValue = this.wrapper.find(`[data-measure-type="${type}"]`).find('.DashboardCountryDetail-MeasureValue');
        expect(measureValue.text()).toContain(expectedValue);
        return this;
    }

    chartSelectionsHandled(types: ChartType[], expectedHandler: sinon.SinonSpy): this {
        types.forEach(type => this.chartSelectionHandled(type, expectedHandler));
        return this;
    }

    chartSelectionHandled(type: ChartType, expectedHandler: sinon.SinonSpy): this {
        const measureValue = this.wrapper.find(`[data-measure-type="${type}"]`).find('.DashboardCountryDetail-MeasureChartButton');
        const prevCallCount = expectedHandler.callCount;
        measureValue.simulate('click');
        expect(expectedHandler.callCount).toBe(prevCallCount + 1);
        expect(expectedHandler.lastCall.args.length).toBe(1);
        expect(expectedHandler.lastCall.args[0]).toBe(type);
        return this;
    }
}

class ShallowChartAssert {
    private wrapper: Enzyme.ShallowWrapper;

    constructor(wrapper: Enzyme.ShallowWrapper) {
        this.wrapper = wrapper;
    }

    rendered<T>(component: React.ComponentClass<ChartProps<T>>, chartsData: ChartsData): this {
        const chart = this.wrapper.find(component);
        expect(chart.length).toBe(1);
        expect(chart.props().data).toMatchObject(chartsData);
        return this;
    }

    notRendered(): this {
        expect(this.wrapper.find(BarChart).length).toBe(0);
        expect(this.wrapper.find(LineChart).length).toBe(0);
        return this;
    }
}
