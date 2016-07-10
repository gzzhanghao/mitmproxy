import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { connect } from 'react-redux'

import { init as appInit, destruct as appDestruct } from '../ducks/app'
import { setSelectedInput } from '../ducks/ui'
import Header from './Header'
import EventLog from './EventLog'
import Footer from './Footer'
import { Key } from '../utils.js'

class ProxyAppMain extends Component {

    static childContextTypes = {
        returnFocus: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context)

        this.focus = this.focus.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    componentWillMount() {
        this.props.appInit()
    }

    /**
     * @todo listen to window's key events
     */
    componentDidMount() {
        this.focus()
    }

    componentWillUnmount() {
        this.props.appDestruct()
    }

    componentWillReceiveProps(nextProps) {

    }

    /**
     * @todo remove it
     */
    focus() {
        document.activeElement.blur()
        window.getSelection().removeAllRanges()
        ReactDOM.findDOMNode(this).focus()
    }

    /**
     * @todo move to actions
     * @todo bind on window
     */
    onKeyDown(e) {
        switch (e.keyCode) {
            case Key.I:
                this.props.setSelectedInput('intercept')
                break
            case Key.L:
                this.props.setSelectedInput('search')
                break
            case Key.H:
                this.props.setSelectedInput('highlight')
                break
            default:
                let main = this.refs.view.refs.wrappedInstance || this.refs.view
                if (main.onMainKeyDown) {
                    main.onMainKeyDown(e)
                }
                return // don't prevent default then
        }

        e.preventDefault()
    }

    render() {
        const { showEventLog, location, children } = this.props
        return (
            <div id="container" tabIndex="0" onKeyDown={this.onKeyDown}>
                <Header ref="header"/>
                {React.cloneElement(
                    children,
                    { ref: 'view', location }
                )}
                {showEventLog && (
                    <EventLog key="eventlog"/>
                )}
                <Footer />
            </div>
        )
    }
}

export default connect(
    state => ({
        showEventLog: state.eventLog.visible,
        settings: state.settings.settings,
        flowId: state.flows.views.main.selected[0],
        panel: state.ui.panel,
        query: state.ui.query
    }),
    {
        appInit,
        appDestruct,
        setSelectedInput
    }
)(ProxyAppMain)
