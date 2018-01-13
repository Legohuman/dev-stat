import ConversionUtils from '../../utils/ConversionUtils';
import * as moment from 'moment';

it('convert defined moment to string', () => {
    expect(ConversionUtils.momentToString(moment("12-25-1995", "MM-DD-YYYY"))).toBe('25.12.1995')
});

it('convert undefined moment to string', () => {
    expect(ConversionUtils.momentToString(undefined)).toBe(undefined)
});

it('convert defined number to string', () => {
    expect(ConversionUtils.toStringOrUndefined(1)).toBe('1')
});

it('convert zero number to string', () => {
    expect(ConversionUtils.toStringOrUndefined(0)).toBe('0')
});

it('convert NaN number to string', () => {
    expect(ConversionUtils.toStringOrUndefined(NaN)).toBe('NaN')
});

it('convert string to string', () => {
    expect(ConversionUtils.toStringOrUndefined('s')).toBe('s')
});

it('convert empty string to string', () => {
    expect(ConversionUtils.toStringOrUndefined('')).toBe('')
});

it('convert undefined string to string', () => {
    expect(ConversionUtils.toStringOrUndefined(undefined)).toBe(undefined)
});