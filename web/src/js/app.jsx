import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Route, Router as ReactRouter, hashHistory, Redirect } from 'react-router'

import ProxyApp from './components/ProxyApp'
import rootReducer from './ducks/index'
import { add as addLog } from './ducks/eventLog'

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger');
  middlewares.push(createLogger());
}

// logger must be last
const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
)

// @todo move to ProxyApp
window.addEventListener('error', msg => {
    store.dispatch(addLog(msg))
})

// @todo remove this
document.addEventListener('DOMContentLoaded', () => {
    render(
        <Provider store={store}>
            <ReactRouter history={hashHistory}>
                <Redirect from="/" to="/flows" />
                <Route path="/flows" component={ProxyApp} />
                <Route path="/flows/:flowId/:detailTab" component={ProxyApp} />
            </ReactRouter>
        </Provider>,
        document.getElementById("mitmproxy")
    )
})
