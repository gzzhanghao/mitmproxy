import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Query } from '../actions.js'
import { Key } from '../utils.js'
import Splitter from './common/Splitter'
import FlowTable from './FlowTable'
import FlowView from './FlowView'
import * as flowsActions from '../ducks/flows'
import { select as selectFlow, updateFilter, updateHighlight } from '../ducks/views/main'
import { setPanel } from '../ducks/ui'

class MainView extends Component {

    static propTypes = {
        highlight: PropTypes.string,
        sort: PropTypes.object,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    /**
     * @todo move to actions
     * @todo replace with mapStateToProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.flowId === nextProps.flowId && this.props.panel === nextProps.panel && this.props.query === nextProps.query) {
            // Update redux store with route changes
            if (nextProps.routeParams.flowId !== nextProps.flowId) {
                this.props.selectFlow(nextProps.routeParams.flowId)
            }
            if (nextProps.routeParams.detailTab !== nextProps.panel) {
                this.props.setPanel(nextProps.routeParams.detailTab)
            }
            if (nextProps.location.query[Query.SEARCH] !== nextProps.filter) {
                this.props.updateFilter(nextProps.location.query[Query.SEARCH], false)
            }
            if (nextProps.location.query[Query.HIGHLIGHT] !== nextProps.highlight) {
                this.props.updateHighlight(nextProps.location.query[Query.HIGHLIGHT], false)
            }
            return
        }
        if(nextProps.flowId) {
            this.context.router.replace({ pathname: `/flows/${nextProps.flowId}/${nextProps.panel}` , query: nextProps.query})
        } else {
            this.context.router.replace({ pathname: '/flows' , query: nextProps.query})
        }
    }

    /**
     * @todo move to actions
     */
    selectFlowRelative(shift) {
        const { flows, flowId, selectedFlow } = this.props
        let index = 0
        if (!flowId) {
            if (shift < 0) {
                index = flows.length - 1
            }
        } else {
            index = Math.min(
                Math.max(0, flows.indexOf(selectedFlow) + shift),
                flows.length - 1
            )
        }
        this.props.selectFlow((flows[index] || {}).id)
    }

    /**
     * @todo move to actions
     */
    onMainKeyDown(e) {
        var flow = this.props.selectedFlow
        if (e.ctrlKey) {
            return
        }
        let flowDetails = null
        if(this.refs.flowDetails) {
            flowDetails = this.refs.flowDetails.refs.wrappedInstance || this.refs.flowDetails
        }
        switch (e.keyCode) {
            case Key.K:
            case Key.UP:
                this.selectFlowRelative(-1)
                break
            case Key.J:
            case Key.DOWN:
                this.selectFlowRelative(+1)
                break
            case Key.SPACE:
            case Key.PAGE_DOWN:
                this.selectFlowRelative(+10)
                break
            case Key.PAGE_UP:
                this.selectFlowRelative(-10)
                break
            case Key.END:
                this.selectFlowRelative(+1e10)
                break
            case Key.HOME:
                this.selectFlowRelative(-1e10)
                break
            case Key.ESC:
                this.props.selectFlow(undefined)
                break
            case Key.H:
            case Key.LEFT:
                if (flowDetails) {
                    flowDetails.nextTab(-1)
                }
                break
            case Key.L:
            case Key.TAB:
            case Key.RIGHT:
                if (flowDetails) {
                    flowDetails.nextTab(+1)
                }
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
                if (flowDetails) {
                    flowDetails.promptEdit()
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
        const { flows, selectedFlow, highlight } = this.props
        return (
            <div className="main-view">
                <FlowTable
                    ref="flowTable"
                    flows={flows}
                    selected={selectedFlow}
                    highlight={highlight}
                    onSelect={flow => this.props.selectFlow(flow.id)}
                />
                {selectedFlow && [
                    <Splitter key="splitter"/>,
                    <FlowView
                        key="flowDetails"
                        ref="flowDetails"
                        tab={this.props.routeParams.detailTab}
                        updateFlow={data => this.props.updateFlow(selectedFlow, data)}
                        flow={selectedFlow}
                    />
                ]}
            </div>
        )
    }
}

export default connect(
    state => ({
        flows: state.flows.views.main.view.data,
        filter: state.flows.views.main.filter,
        highlight: state.flows.views.main.highlight,
        selectedFlow: state.flows.list.byId[state.flows.views.main.selected[0]],
        panel: state.ui.panel,
        flowId: state.flows.views.main.selected[0],
        query: state.ui.query
    }),
    {
        selectFlow,
        updateFilter,
        updateHighlight,
        setPanel,
        updateFlow: flowsActions.update,
        clearFlows: flowsActions.clear,
        duplicateFlow: flowsActions.duplicate,
        removeFlow: flowsActions.remove,
        acceptAllFlows: flowsActions.acceptAll,
        acceptFlow: flowsActions.accept,
        replayFlow: flowsActions.replay,
        revertFlow: flowsActions.revert,
    },
    undefined,
    { withRef: true }
)(MainView)
