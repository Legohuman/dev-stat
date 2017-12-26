import * as React from 'react';
import './DashboardMap.css';
import { DashboardMapData } from '../../types/DashboardState';

class DashboardMap extends React.Component<DashboardMapData, object> {
    render() {
        return (
            <div className="DashboardMap">
                Map
            </div>
        );
    }
}

export default DashboardMap;
