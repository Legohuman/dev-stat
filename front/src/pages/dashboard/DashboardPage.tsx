import * as React from 'react';
import './DashboardPage.css';
import { DashboardFilterContainer } from './DashboardFilter';
import { DashboardMapContainer } from './DashboardMap';
import { DashboardCountryDetailContainer } from './DashboardCountryDetail';
import { MessageListContainer } from '../../components/MessageList';

class DashboardPage extends React.Component<object, object> {

    render() {
        console.log('render DashboardPage');
        return (
            <div className="DashboardPage">
                <MessageListContainer/>
                <DashboardFilterContainer/>
                <DashboardMapContainer/>
                <DashboardCountryDetailContainer/>
            </div>
        );
    }
}

export default DashboardPage;
