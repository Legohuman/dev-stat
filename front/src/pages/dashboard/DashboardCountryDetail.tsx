import * as React from 'react';
import './DashboardCountryDetail.css';
import { DashboardCountryDetailData } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';

class DashboardMap extends React.Component<DashboardCountryDetailData & DashboardPageHandlers, object> {
    render() {
        return (
            <div className="DashboardCountryDetail">
                Country detail
            </div>
        );
    }
}

export default DashboardMap;
