import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ValidateEditor from './ValueEditor/ValidateEditor'

export default class ValueEditor extends Component {

    static contextTypes = {
        returnFocus: PropTypes.func,
    }

    static propTypes = {
        content: PropTypes.string.isRequired,
        onDone: PropTypes.func.isRequired,
        inline: PropTypes.bool,
    }

    render() {
        var tag = this.props.inline ? "span" : 'div'
        return (
            <ValidateEditor
                {...this.props}
                onStop={() => document.activeElement.blur()}
                tag={tag}
            />
        )
    }
}
