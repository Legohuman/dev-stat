import * as _ from 'lodash';

const economyLevels = ['very poor', 'poor', 'below average', 'average', 'above average', 'wealthy', 'very wealthy'];

const Renderers = {
    numberWithCountSuffix(val: number): string {
        if (val > 1e9) {
            return _.floor(val / 1e9, 1) + ' B';
        } else if (val > 1e6) {
            return _.floor(val / 1e6, 1) + ' M';
        } else if (val > 1e4) {
            return _.floor(val / 1e3, 1) + ' k';
        }
        return val + '';
    },

    economyLevel(val: number): string {
        return economyLevels[val - 1] || 'unknown';
    }
};

export default Renderers;