import * as React from 'react';
import './DashboardMap.css';
import { DashboardMapData } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';

class DashboardMap extends React.Component<DashboardMapData & DashboardPageHandlers, object> {
    render() {
        return (
            <div className="DashboardMap">
                Map
            </div>
        );
    }
}

export default DashboardMap;
