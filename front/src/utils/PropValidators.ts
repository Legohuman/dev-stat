export const Validators = {
    positiveNumber(propName: string, value: any): string | undefined {
        if (value <= 0) {
            return createError(propName, value, 'Positive number is expected.');
        }
        return undefined;
    },

    notNegativeNumber(propName: string, value: any): string | undefined {
        if (value < 0) {
            return createError(propName, value, 'Not negative number is expected.');
        }
        return undefined;
    }
};

function createError(propName: string, value: any, errorMessage: string): string {
    return `Invalid value for ${propName}: ${value}. ${errorMessage}`;
}