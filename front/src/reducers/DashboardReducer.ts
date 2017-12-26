import { Action, ActionType } from '../actions/Actions';
import { DashboardState } from '../types/DashboardState';
import { ActionHandlerSelector } from '../utils/ActionHandlerSelector';

const handlerSelector = new ActionHandlerSelector<DashboardState>()
    .addHandler(ActionType.selectCountry, (action, state) => {
        return state;
    })
    .addHandler(ActionType.setFilterValue, (action, state) => {
        return state;
    });

function getDefaultDashboardState() {
    return {
        filter: {
            startDate: new Date(),
            endDate: new Date()
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
