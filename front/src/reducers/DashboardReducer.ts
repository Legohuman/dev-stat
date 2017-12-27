import * as moment from 'moment';
import { Action, ActionType, SelectCountry, SetFilterPeriod } from '../actions/Actions';
import { DashboardState } from '../types/DashboardState';
import { ActionHandlerSelector } from '../utils/ActionHandlerSelector';

const handlerSelector = new ActionHandlerSelector<DashboardState>()
    .addHandler(ActionType.selectCountry, (action, state) => {
        const actionImpl = <SelectCountry> action;
        return {...state, map: {...state.map, selectedCountryCode: actionImpl.countryCode}};
    })
    .addHandler(ActionType.setFilterPeriod, (action, state) => {
        const actionImpl = <SetFilterPeriod> action;
        return {
            ...state,
            filter: {
                ...state.filter,
                startDate: actionImpl.startDate,
                endDate: actionImpl.endDate
            }
        };
    });

function getDefaultDashboardState() {
    return {
        filter: {
            startDate: moment().subtract(7, 'days'),
            endDate: moment()
        },
        map: {
            selectedCountryCode: ''
        },
        countryDetail: {
            meanAge: 0,
            meanSalary: 0,
            meanExperience: 0,
            meanCompanySize: 0,
            ageDistribution: [],
            salaryDistribution: [],
            experienceDistribution: [],
            companySizeDistribution: []
        }
    };
}

export default function nextState(state: DashboardState = getDefaultDashboardState(), action: Action): DashboardState {
    return handlerSelector.handle(action, state);
}
