import Renderers from '../../utils/Renderers';

it('render positive hundreds number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(550.1234)).toBe('550.1234')
});

it('render positive tens thousands number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(12590.1234)).toBe('12.5 k')
});

it('render positive millions number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(12690000.1234)).toBe('12.6 M')
});

it('render positive billions number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(12790000000.1234)).toBe('12.7 B')
});

it('render negative tens thousands number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(-12590.1234)).toBe('-12.5 k')
});

it('render negative millions number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(-12690000.1234)).toBe('-12.6 M')
});

it('render negative billions number with suffix', () => {
    expect(Renderers.numberWithCountSuffix(-12790000000.1234)).toBe('-12.7 B')
});

it('render defined economy level', () => {
    expect(Renderers.economyLevel(3)).toBe('below average')
});

it('render min economy level', () => {
    expect(Renderers.economyLevel(1)).toBe('very poor')
});

it('render max economy level', () => {
    expect(Renderers.economyLevel(7)).toBe('very wealthy')
});

it('render undefined economy level (underflow)', () => {
    expect(Renderers.economyLevel(0)).toBe('unknown')
});

it('render undefined economy level (overflow)', () => {
    expect(Renderers.economyLevel(8)).toBe('unknown')
});