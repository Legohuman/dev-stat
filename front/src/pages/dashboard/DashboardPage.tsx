import * as React from 'react';
import './DashboardPage.css';
import DashboardFilter from './DashboardFilter';
import DashboardMap from './DashboardMap';
import DashboardCountryDetail from './DashboardCountryDetail';
import { DashboardState } from '../../types/DashboardState';
import { connect, Dispatch } from 'react-redux';

class DashboardPage extends React.Component<DashboardState, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardPage">
                <DashboardFilter {...p.filter}/>
                <DashboardMap {...p.map}/>
                <DashboardCountryDetail {...p.countryDetail}/>
            </div>
        );
    }
}

function mapStateToProps(state: DashboardState) {
    return state;
}

function mapDispatchToProps(dispatch: Dispatch<DashboardState>) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
