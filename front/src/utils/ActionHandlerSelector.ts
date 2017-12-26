import { Action, ActionType } from '../actions/Actions';

export class ActionHandlerSelector<S> {
    handlers: {
        [actionType: string]: (action: Action, state: S) => S;
    } = {};

    addHandler(actionType: ActionType, handler: (action: Action, state: S) => S): ActionHandlerSelector<S> {
        this.handlers[actionType.toString()] = handler;
        return this;
    }

    handle(action: Action, state: S): S {
        const handler = this[action.type];
        if (handler) {
            return handler(action, state);
        }
        return state;
    }
}