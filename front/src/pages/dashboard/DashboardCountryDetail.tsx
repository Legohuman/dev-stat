import * as React from 'react';
import './DashboardCountryDetail.css';
import { DashboardCountryDetailData } from '../../types/DashboardState';

class DashboardMap extends React.Component<DashboardCountryDetailData, object> {
    render() {
        return (
            <div className="DashboardCountryDetail">
                Country detail
            </div>
        );
    }
}

export default DashboardMap;
