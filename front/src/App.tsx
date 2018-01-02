import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import './App.css';
import DashboardPage from './pages/dashboard/DashboardPage';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Navbar inverse={true}>
                    <Nav>
                        <NavItem href="#">Dashboard</NavItem>
                    </Nav>
                </Navbar>

                <DashboardPage/>
            </div>
        );
    }
}

export default App;
