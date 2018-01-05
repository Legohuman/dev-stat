import * as _ from 'lodash';

export class ChartTestHelper {
    private $: CheerioStatic;

    constructor($: CheerioStatic) {
        this.$ = $;
    }

    assertAxis(axisSelector: string): ChartAxisAssert {
        return new ChartAxisAssert(this.$, this.$(axisSelector));
    }

    assertMeanLine(): ChartMeanLineAssert {
        return new ChartMeanLineAssert(this.$);
    }

    assertBars(): ChartBarsAssert {
        return new ChartBarsAssert(this.$);
    }

    assertDataLine(): ChartDataLineAssert {
        return new ChartDataLineAssert(this.$);
    }
}

class ChartAxisAssert {
    private $: CheerioStatic;
    private axisElem: Cheerio;

    constructor($: CheerioStatic, axisElem: Cheerio) {
        this.$ = $;
        this.axisElem = axisElem;
    }

    rendered(): this {
        expect(this.axisElem.length).toBe(1);
        return this;
    }

    hasDomainExtent(expectedMinValue: number, expectedMaxValue: number): this {
        const tickValues: number[] = this.axisElem.find('g.tick text').map((i, elem) => this.$(elem).text()).get().map(val => +val);
        const minValue = _.min(tickValues);
        const maxValue = _.max(tickValues);
        expect(minValue).toBe(expectedMinValue);
        expect(maxValue).toBe(expectedMaxValue);
        return this;
    }

    hasNoDomainExtent(): this {
        const tickElems = this.axisElem.find('g.tick');
        expect(tickElems.length).toBe(1);
        return this;
    }
}

class ChartMeanLineAssert {
    private meanLineElem: Cheerio;
    private meanLineLabelElem: Cheerio;

    constructor($: CheerioStatic) {
        this.meanLineElem = $('line[data-type="mean-line"]');
        this.meanLineLabelElem = $('text[data-type="mean-line"]');
    }

    rendered(): this {
        expect(this.meanLineElem.length).toBe(1);
        expect(this.meanLineLabelElem.length).toBe(1);
        return this;
    }

    notRendered(): this {
        expect(this.meanLineElem.length).toBe(0);
        expect(this.meanLineLabelElem.length).toBe(0);
        return this;
    }

    hasDomainValue(expectedValue: number): this {
        const value: number = +this.meanLineLabelElem.text();
        expect(value).toBeCloseTo(expectedValue);
        return this;
    }

    hasCoordinate(expectedValue: number): this {
        const x1: number = +this.meanLineElem.attr('x1');
        const x2: number = +this.meanLineElem.attr('x2');
        expect(x1).toBeCloseTo(expectedValue);
        expect(x2).toBeCloseTo(expectedValue);
        return this;
    }
}

class ChartBarsAssert {
    private $: CheerioStatic;
    private rectElems: Cheerio;

    constructor($: CheerioStatic) {
        this.$ = $;
        this.rectElems = $('rect');
    }

    count(expectedCount: number): this {
        expect(this.rectElems.length).toBe(expectedCount);
        return this;
    }

    hasBars(bars: Array<ChartBar>): this {
        bars.forEach(expectedBar => {
            const matchedRectElem = this.rectElems.filter((i, elem) => {
                return this.areChartBarsSame(expectedBar, this.toChartBar(this.$(elem)));
            }).first();
            expect(matchedRectElem.length).toBe(1);
        });

        return this;
    }

    private toChartBar(barElem: Cheerio): ChartBar {
        return {
            x: +barElem.attr('x'),
            y: +barElem.attr('y'),
            width: +barElem.attr('width'),
            height: +barElem.attr('height'),
        }
    }

    private areChartBarsSame(bar1: ChartBar, bar2: ChartBar): boolean {
        return closeTo(bar1.x, bar2.x) && closeTo(bar1.y, bar2.y) &&
            closeTo(bar1.width, bar2.width) && closeTo(bar1.height, bar2.height)
    }
}

class ChartDataLineAssert {
    private dataLineElem: Cheerio;

    constructor($: CheerioStatic) {
        this.dataLineElem = $('path[data-type="data-line"]');
    }

    rendered(): this {
        expect(this.dataLineElem.length).toBe(1);
        return this;
    }

    notRendered(): this {
        expect(this.dataLineElem.length).toBe(0);
        return this;
    }

    hasCoordinates(pathString: string): this {
        expect(this.dataLineElem.attr('d')).toBe(pathString);

        return this;
    }
}

function closeTo(val1: number, val2: number, precision: number = 2): boolean {
    return _.round(val1 - val2, 2) === 0
}

export interface ChartBar {
    x: number;
    y: number;
    width: number;
    height: number;
}