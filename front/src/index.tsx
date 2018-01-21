import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { applyMiddleware, createStore, Middleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './App';
import './index.css';

import DashboardReducer from './reducers/DashboardReducer';
import { DashboardState } from './types/DashboardState';

const middlewareItems: Middleware[] = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middlewareItems.push(logger);
}
const store = createStore<DashboardState>(DashboardReducer, applyMiddleware.apply(null, middlewareItems));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);