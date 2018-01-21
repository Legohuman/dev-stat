import * as Enzyme from 'enzyme';
import * as sinon from 'sinon';
import { CountryInfo } from '../../../types/DashboardState';

class WorldMapAssert {
    private wrapper: Enzyme.ReactWrapper;

    constructor(wrapper: Enzyme.ReactWrapper) {
        this.wrapper = wrapper;
    }

    rendered(): this {
        expect(this.wrapper.find('.WorldMap-Svg').length).toBe(1);
        expect(this.wrapper.find('.WorldMap-GestureHint').length).toBe(1);
        expect(this.wrapper.find('.WorldMap-Tooltip').length).toBe(1);
        return this;
    }

    countryTooltipText(countryId: string, expectedValues: string[], notExpectedValues: string[]): this {
        const mouseoverEvent = new MouseEvent("mouseover");
        const countryElement = this.wrapper.getDOMNode().querySelector(`[data-country-id="${countryId}"]`);
        expect(countryElement).toBeDefined();

        countryElement!!.dispatchEvent(mouseoverEvent);
        const tooltipText = this.wrapper.find('.WorldMap-Tooltip').text();

        expectedValues.forEach(value => expect(tooltipText).toContain(value));
        notExpectedValues.forEach(value => expect(tooltipText).not.toContain(value));
        return this;
    }

    countryClickHandled(countryId: string, expectedHandler: sinon.SinonSpy): this {
        const mouseoverEvent = new MouseEvent("click");
        const countryElement = this.wrapper.getDOMNode().querySelector(`[data-country-id="${countryId}"]`);
        expect(countryElement).toBeDefined();

        const prevCallCount = expectedHandler.callCount;
        countryElement!!.dispatchEvent(mouseoverEvent);

        expect(expectedHandler.callCount).toBe(prevCallCount + 1);
        expect(expectedHandler.lastCall.args.length).toBe(1);
        const countryInfo = expectedHandler.lastCall.args[0] as CountryInfo;
        expect(countryInfo.id).toBe(countryId);
        return this;
    }

    countriesClickHandled(countriesId: string[], expectedHandler: sinon.SinonSpy): this {
        countriesId.forEach(countryId => this.countryClickHandled(countryId, expectedHandler));
        return this;
    }
}

export class DashboardMapAssertFactory {
    private wrapper: Enzyme.ReactWrapper;

    constructor(wrapper: Enzyme.ReactWrapper) {
        this.wrapper = wrapper;
    }

    assertMap(): WorldMapAssert {
        return new WorldMapAssert(this.wrapper);
    }
}
