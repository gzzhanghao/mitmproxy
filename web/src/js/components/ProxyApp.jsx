import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { connect } from 'react-redux'

import { init as appInit, destruct as appDestruct } from '../ducks/app'
import { setSelectedInput, setPromptOpen, setPanelRelative } from '../ducks/ui'
import { select as selectFlow, selectRelative as selectFlowRelative } from '../ducks/views/main'
import * as flowsActions from '../ducks/flows'
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

        this.onKeyDown = this.onKeyDown.bind(this)
    }

    componentWillMount() {
        this.props.appInit()
    }

    /**
     * @todo listen to window's key events
     */
    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        this.props.appDestruct()
        window.removeEventListener('keydown', this.onKeyDown)
    }

    /**
     * @todo move to actions
     * @todo bind on window
     */
    onKeyDown(e) {
        let flow = this.props.selectedFlow
        let panel = this.props.panel
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
            case Key.K:
            case Key.UP:
                this.props.selectFlowRelative(-1, this.props.flows, flow)
                break
            case Key.J:
            case Key.DOWN:
                this.props.selectFlowRelative(+1, this.props.flows, flow)
                break
            case Key.SPACE:
            case Key.PAGE_DOWN:
                this.props.selectFlowRelative(+10, this.props.flows, flow)
                break
            case Key.PAGE_UP:
                this.props.selectFlowRelative(-10, this.props.flows, flow)
                break
            case Key.END:
                this.props.selectFlowRelative(+1e10, this.props.flows, flow)
                break
            case Key.HOME:
                this.props.selectFlowRelative(-1e10, this.props.flows, flow)
                break
            case Key.ESC:
                this.props.selectFlow(undefined)
                break
            case Key.H:
            case Key.LEFT:
                this.props.setPanelRelative(-1, panel, flow)
                break
            case Key.L:
            case Key.TAB:
            case Key.RIGHT:
                this.props.setPanelRelative(+1, panel, flow)
                break
            case Key.C:
                if (e.shiftKey) {
                    this.props.clearFlows()
                }
                break
            case Key.D:
                if (flow) {
                    if (e.shiftKey) {
                        this.props.duplicateFlow(flow)
                    } else {
                        this.props.removeFlow(flow)
                    }
                }
                break
            case Key.A:
                if (e.shiftKey) {
                    this.props.acceptAllFlows()
                } else if (flow && flow.intercepted) {
                    this.props.acceptFlow(flow)
                }
                break
            case Key.R:
                if (!e.shiftKey && flow) {
                    this.props.replayFlow(flow)
                }
                break
            case Key.V:
                if (e.shiftKey && flow && flow.modified) {
                    this.props.revertFlow(flow)
                }
                break
            case Key.E:
                if (flow) {
                    this.props.setPromptOpen(true)
                }
                break
            case Key.SHIFT:
                break
            default:
                console.debug('keydown', e.keyCode)
                return
        }

        e.preventDefault()
    }

    render() {
        const { showEventLog, location, children } = this.props
        return (
            <div id="container" tabIndex="0">
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
        selectedFlow: state.flows.list.byId[state.flows.views.main.selected[0]],
        flows: state.flows.views.main.view.data,
        panel: state.ui.panel
    }),
    {
        appInit,
        appDestruct,
        setSelectedInput,
        selectFlow,
        selectFlowRelative,
        setPromptOpen,
        setPanelRelative,
        clearFlows: flowsActions.clear,
        duplicateFlow: flowsActions.duplicate,
        removeFlow: flowsActions.remove,
        acceptAllFlows: flowsActions.acceptAll,
        acceptFlow: flowsActions.accept,
        replayFlow: flowsActions.replay,
        revertFlow: flowsActions.revert
    }
)(ProxyAppMain)
