import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FilterInput from './FilterInput'
import { Query } from '../../actions.js'
import { update as updateSettings } from '../../ducks/settings'
import { setSelectedInput } from '../../ducks/ui'
import { updateFilter, updateHighlight } from '../../ducks/views/main'

class MainMenu extends Component {

    static title = 'Start'
    static route = 'flows'

    static propTypes = {
        filter: PropTypes.string,
        highlight: PropTypes.string,
        settings: PropTypes.object.isRequired,
        updateFilter: PropTypes.func.isRequired,
        updateHighlight: PropTypes.func.isRequired,
        updateSettings: PropTypes.func.isRequired,
    }

    componentDidUpdate() {
        if(this.props.selectedInput) {
            this.props.setSelectedInput(null)
        }
    }

    render() {
        const { filter, highlight, selectedInput, settings, flowList, updateSettings, updateFilter, updateHighlight } = this.props

        return (
            <div>
                <div className="menu-row">
                    <FilterInput
                        filterInputName="search"
                        selectedInput={selectedInput}
                        placeholder="Search"
                        type="search"
                        color="black"
                        value={filter || ''}
                        onChange={search => updateFilter(search, flowList)}
                    />
                    <FilterInput
                        filterInputName="highlight"
                        selectedInput={selectedInput}
                        placeholder="Highlight"
                        type="tag"
                        color="hsl(48, 100%, 50%)"
                        value={highlight || ''}
                        onChange={highlight => updateHighlight(highlight)}
                    />
                    <FilterInput
                        filterInputName="intercept"
                        selectedInput={selectedInput}
                        placeholder="Intercept"
                        type="pause"
                        color="hsl(208, 56%, 53%)"
                        value={settings.intercept || ''}
                        onChange={intercept => updateSettings({ intercept })}
                    />
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }
}

export default connect(
    state => ({
        flowList: state.flows.list,
        settings: state.settings.settings,
        selectedInput: state.ui.selectedInput,
        filter: state.flows.views.main.filter,
        highlight: state.flows.views.main.highlight,
    }),
    {
        updateSettings,
        setSelectedInput,
        updateFilter,
        updateHighlight
    },
    null,
    {
        withRef: true,
    }
)(MainMenu);
