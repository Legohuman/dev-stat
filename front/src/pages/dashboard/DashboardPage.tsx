import * as React from 'react';
import './DashboardPage.css';
import DashboardFilter from './DashboardFilter';
import DashboardMap from './DashboardMap';
import DashboardCountryDetail from './DashboardCountryDetail';

class DashboardPage extends React.Component {
    render() {
        return (
            <div className="DashboardPage">
                <DashboardFilter
                    startDate={new Date}
                    endDate={new Date()}
                />
                <DashboardMap/>
                <DashboardCountryDetail/>
            </div>
        );
    }
}

export default DashboardPage;
