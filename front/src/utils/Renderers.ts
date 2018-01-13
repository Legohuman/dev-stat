import * as _ from 'lodash';

const economyLevels = ['very poor', 'poor', 'below average', 'average', 'above average', 'wealthy', 'very wealthy'];

const Renderers = {
    numberWithCountSuffix(val: number): string {
        const absVal = Math.abs(val),
            roundFn = val >= 0 ? _.floor : _.ceil;
        if (absVal > 1e9) {
            return roundFn(val / 1e9, 1) + ' B';
        } else if (absVal > 1e6) {
            return roundFn(val / 1e6, 1) + ' M';
        } else if (absVal > 1e4) {
            return roundFn(val / 1e3, 1) + ' k';
        }
        return val + '';
    },

    economyLevel(val: number): string {
        return economyLevels[val - 1] || 'unknown';
    }
};

export default Renderers;