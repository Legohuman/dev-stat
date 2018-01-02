import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import DashboardReducer from './reducers/DashboardReducer';
import { DashboardState } from './types/DashboardState';

const store = createStore<DashboardState>(DashboardReducer, applyMiddleware(
    thunk, logger
));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
