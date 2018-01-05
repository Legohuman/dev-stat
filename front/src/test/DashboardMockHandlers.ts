import * as sinon from 'sinon';

export function dashboardMockHandlers() {
    return {
        handlePeriodChange: sinon.spy(),
        handleCountryChange: sinon.spy(),
        handleChartChange: sinon.spy()
    };
}