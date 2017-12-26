import { AnyAction } from 'redux';

export enum ActionType {
    setFilterValue = 'setFilterValue',
    selectCountry = 'selectCountry',
}

export enum DashboardFilterField {
    startDate = 'startDate',
    endDate = 'endDate',
}

export abstract class Action implements AnyAction {
    readonly type: ActionType;
    [extraProps: string]: any;

    constructor(actionType: ActionType) {
        this.actionType = actionType;
    }
}

export class SetFilterDateValue extends Action {
    readonly field: DashboardFilterField;
    readonly value: Date;

    constructor(field: DashboardFilterField, value: Date) {
        super(ActionType.setFilterValue);
        this.field = field;
        this.value = value;
    }
}

export class SelectCountry extends Action {
    readonly countryCode: string;

    constructor(countryCode: string) {
        super(ActionType.selectCountry);
        this.countryCode = countryCode;
    }
}
