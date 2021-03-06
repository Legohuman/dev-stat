import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import './App.css';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ToastContainer } from 'react-toastify';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <ToastContainer/>
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
