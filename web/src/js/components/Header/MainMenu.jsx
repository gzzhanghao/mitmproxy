import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FilterInput from './FilterInput'
import { Query } from '../../actions.js'
import { update as updateSettings } from '../../ducks/settings'
import { setSelectedInput, updateQuery } from '../../ducks/ui'

class MainMenu extends Component {

    static title = 'Start'
    static route = 'flows'

    static propTypes = {
        query: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        updateQuery: PropTypes.func.isRequired,
        updateSettings: PropTypes.func.isRequired,
    }

    componentDidUpdate() {
        if(this.refs[this.props.selectedInput]) {
            this.refs[this.props.selectedInput].select()
        }
        this.props.setSelectedInput(null)
    }

    render() {
        const { query, settings, updateSettings, updateQuery } = this.props

        return (
            <div>
                <div className="menu-row">
                    <FilterInput
                        ref="search"
                        placeholder="Search"
                        type="search"
                        color="black"
                        value={query[Query.SEARCH] || ''}
                        onChange={search => updateQuery({ [Query.SEARCH]: search })}
                    />
                    <FilterInput
                        ref="highlight"
                        placeholder="Highlight"
                        type="tag"
                        color="hsl(48, 100%, 50%)"
                        value={query[Query.HIGHLIGHT] || ''}
                        onChange={highlight => updateQuery({ [Query.HIGHLIGHT]: highlight })}
                    />
                    <FilterInput
                        ref="intercept"
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
        settings: state.settings.settings,
        selectedInput: state.ui.selectedInput,
        query: state.ui.query
    }),
    {
        updateSettings,
        updateQuery,
        setSelectedInput
    },
    null,
    {
        withRef: true,
    }
)(MainMenu);
