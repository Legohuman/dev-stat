import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import './App.css';
import DashboardPage from './pages/dashboard/DashboardPage';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Navbar inverse={true}>
                    <Nav>
                        <NavItem eventKey={1} href="#">Dashboard</NavItem>
                        <NavItem eventKey={2} href="#">Generator</NavItem>
                    </Nav>
                </Navbar>

                <DashboardPage/>
            </div>
        );
    }
}

export default App;
