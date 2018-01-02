import * as React from 'react';
import './DashboardPage.css';
import DashboardFilter from './DashboardFilter';
import DashboardMap from './DashboardMap';
import DashboardCountryDetail from './DashboardCountryDetail';
import { DashboardState } from '../../types/DashboardState';
import { connect } from 'react-redux';
import { createDashboardPageHandlers, DashboardPageHandlers } from './DashboardPageHandlers';
import DashboardMessages from './DashboardMessages';

class DashboardPage extends React.Component<DashboardState & DashboardPageHandlers, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardPage">
                <DashboardMessages {...p.messages}/>
                <DashboardFilter
                    {...p.filter}
                    handlers={p.handlers}
                />
                <DashboardMap
                    {...p.map}
                    handlers={p.handlers}
                />
                <DashboardCountryDetail
                    {...p.countryDetail}
                    handlers={p.handlers}
                />
            </div>
        );
    }
}

function mapStateToProps(state: DashboardState) {
    return state;
}

export default connect(mapStateToProps, createDashboardPageHandlers)(DashboardPage);
