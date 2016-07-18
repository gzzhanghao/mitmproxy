import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import Splitter from './common/Splitter'
import FlowTable from './FlowTable'
import FlowView from './FlowView'
import { select as selectFlow } from '../ducks/views/main'
import { update as updateFlow } from '../ducks/flows'

function MainView({ flows, selectedFlow, panel, highlight, selectFlow, updateFlow }) {
    return (
        <div className="main-view">
            <FlowTable
                flows={flows}
                selected={selectedFlow}
                highlight={highlight}
                onSelect={flow => selectFlow(flow.id)}
            />
            {selectedFlow && [
                <Splitter key="splitter"/>,
                <FlowView
                    key="flowDetails"
                    tab={panel}
                    updateFlow={data => updateFlow(selectedFlow, data)}
                    flow={selectedFlow}
                />
            ]}
        </div>
    )
}

export default connect(
    state => ({
        flows: state.flows.views.main.view.data,
        selectedFlow: state.flows.list.byId[state.flows.views.main.selected[0]],
        highlight: state.flows.views.main.highlight,
        panel: state.ui.panel,
    }),
    {
        selectFlow,
        updateFlow,
    }
)(MainView)
