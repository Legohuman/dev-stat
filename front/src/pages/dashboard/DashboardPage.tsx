import * as React from 'react';
import './DashboardPage.css';
import { DashboardFilterContainer } from './DashboardFilter';
import { DashboardMapContainer } from './DashboardMap';
import { DashboardCountryDetailContainer } from './DashboardCountryDetail';
import { MessageListContainer } from '../../components/MessageList';

class DashboardPage extends React.Component<object, object> {

    render() {
        return (
            <div className="DashboardPage">
                <DashboardFilterContainer/>
                <MessageListContainer/>
                <DashboardMapContainer/>
                <DashboardCountryDetailContainer/>
            </div>
        );
    }
}

export default DashboardPage;
