import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Nav from './FlowView/Nav'
import { Request, Response, ErrorView as Error } from './FlowView/Messages'
import Details from './FlowView/Details'
import Prompt from './Prompt'

import { setPanel, setPromptOpen, openPrompt, closePrompt, setEditType } from '../ducks/ui'

class FlowView extends Component {

    static allTabs = { Request, Response, Error, Details }

    componentDidUpdate() {
        if(this.props.edit) {
            this.props.setEditType(null)
        }
    }

    render() {
        let { flow, tab: active, updateFlow, closePrompt, setEditType } = this.props
        const tabs = ['request', 'response', 'error'].filter(k => flow[k]).concat(['details'])

        if (tabs.indexOf(active) < 0) {
            if (active === 'response' && flow.error) {
                active = 'error'
            } else if (active === 'error' && flow.response) {
                active = 'response'
            } else {
                active = tabs[0]
            }
        }

        const Tab = FlowView.allTabs[_.capitalize(active)]

        return (
            <div className="flow-detail" onScroll={this.adjustHead}>
                <Nav
                    flow={flow}
                    tabs={tabs}
                    active={active}
                    onSelectTab={this.props.setPanel}
                />
                <Tab edit={this.props.edit} flow={flow} updateFlow={updateFlow} />
                {this.props.prompt && (
                    <Prompt
                        options={this.props.prompt}
                        done={ edit => {
                            closePrompt()
                            setEditType(edit) }}
                    />
                )}
            </div>
        )
    }
}

export default connect(
    state => ({
        prompt: state.ui.prompt,
        edit: state.ui.editType
    }),
    {
        setPanel,
        setPromptOpen,
        openPrompt,
        closePrompt,
        setEditType
    },
    undefined,
    { withRef: true }
)(FlowView)
