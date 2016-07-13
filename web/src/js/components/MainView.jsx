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
import { update as updateFlow } from '../ducks/flows'

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
            if (nextProps.routeParams.flowId && nextProps.routeParams.detailTab !== nextProps.panel) {
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
        selectedFlow: state.flows.list.byId[state.flows.views.main.selected[0]],
        filter: state.flows.views.main.filter,
        highlight: state.flows.views.main.highlight,
        panel: state.ui.panel,
        flowId: state.flows.views.main.selected[0],
        query: state.ui.query
    }),
    {
        selectFlow,
        updateFilter,
        updateHighlight,
        setPanel,
        updateFlow,
    },
    undefined,
    { withRef: true }
)(MainView)
