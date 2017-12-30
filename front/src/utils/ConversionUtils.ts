export default {
    toStringOrUndefined(val: any): string | undefined {
        return val ? val.toString() : undefined;
    }
};