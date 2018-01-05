import * as React from 'react';
import * as _ from 'lodash';
import './DashboardPage.css';
import DashboardFilter from './DashboardFilter';
import DashboardMap from './DashboardMap';
import DashboardCountryDetail from './DashboardCountryDetail';
import { ChartType, DashboardState } from '../../types/DashboardState';
import { connect } from 'react-redux';
import { createDashboardPageHandlers, DashboardPageHandlers } from './DashboardPageHandlers';
import MessageList from '../../components/MessageList';

class DashboardPage extends React.Component<DashboardState & DashboardPageHandlers, object> {
    render() {
        const p = this.props,
            messages = _.compact(_.values(p.messages)),
            chartsData = {};
        chartsData[ChartType.age] = {
            meanValue: 2000,
            values: [
                {x: 1500, y: 0.2},
                {x: 2000, y: 0.6},
                {x: 2500, y: 0.2}
            ]
        };

        return (
            <div className="DashboardPage">
                <MessageList messages={messages}/>
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
                    charts={chartsData}
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
