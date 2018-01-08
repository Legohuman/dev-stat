import * as React from 'react';
import * as _ from 'lodash';
import './DashboardPage.css';
import DashboardFilter from './DashboardFilter';
import DashboardMap from './DashboardMap';
import DashboardCountryDetail from './DashboardCountryDetail';
import { DashboardState } from '../../types/DashboardState';
import { connect } from 'react-redux';
import { createDashboardPageHandlers, DashboardPageHandlers } from './DashboardPageHandlers';
import MessageList from '../../components/MessageList';

class DashboardPage extends React.Component<DashboardState & DashboardPageHandlers, object> {

    componentDidMount(): void {
        const p = this.props;

        p.handlers.handlePeriodChange(p.filter.startDate, p.filter.endDate);
    }

    render() {
        const p = this.props,
            messages = _.compact(_.values(p.messages));

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
                    handlers={p.handlers}
                    operations={p.operations}
                />
            </div>
        );
    }
}

function mapStateToProps(state: DashboardState) {
    return state;
}

export default connect(mapStateToProps, createDashboardPageHandlers)(DashboardPage);
