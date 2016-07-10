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

    constructor(props, context) {
        super(props, context)
        this.onSearchChange = this.onSearchChange.bind(this)
        this.onHighlightChange = this.onHighlightChange.bind(this)
    }

    componentDidUpdate() {
        if(this.refs[this.props.selectedInput]) {
            this.refs[this.props.selectedInput].select()
        }
        this.props.setSelectedInput(null)
    }

    onSearchChange(val) {
        this.props.updateQuery({ [Query.SEARCH]: val })
    }

    onHighlightChange(val) {
        this.props.updateQuery({ [Query.HIGHLIGHT]: val })
    }

    render() {
        const { query, settings, updateSettings } = this.props

        return (
            <div>
                <div className="menu-row">
                    <FilterInput
                        ref="search"
                        placeholder="Search"
                        type="search"
                        color="black"
                        value={query[Query.SEARCH] || ''}
                        onChange={this.onSearchChange}
                    />
                    <FilterInput
                        ref="highlight"
                        placeholder="Highlight"
                        type="tag"
                        color="hsl(48, 100%, 50%)"
                        value={query[Query.HIGHLIGHT] || ''}
                        onChange={this.onHighlightChange}
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
