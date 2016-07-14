import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ValueEditor from '../ValueEditor'
import { Key } from '../../utils.js'
import FocusHelper from '../helpers/Focus'

class HeaderEditor extends Component {

    render() {
        return <ValueEditor ref="input" {...this.props} onKeyDown={this.onKeyDown} inline/>
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case Key.BACKSPACE:
                var s = window.getSelection().getRangeAt(0)
                if (s.startOffset === 0 && s.endOffset === 0) {
                    this.props.onRemove(e)
                }
                break
            case Key.TAB:
                if (!e.shiftKey) {
                    this.props.onTab(e)
                }
                break
        }
    }
}

export default class Headers extends Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        message: PropTypes.object.isRequired,
    }

    onChange(row, col, val) {
        const nextHeaders = _.cloneDeep(this.props.message.headers)

        nextHeaders[row][col] = val

        if (!nextHeaders[row][0] && !nextHeaders[row][1]) {
            // do not delete last row
            if (nextHeaders.length === 1) {
                nextHeaders[0][0] = 'Name'
                nextHeaders[0][1] = 'Value'
            } else {
                nextHeaders.splice(row, 1)
                // manually move selection target if this has been the last row.
                if (row === nextHeaders.length) {
                    this._nextSel = `${row - 1}-value`
                }
            }
        }

        this.props.onChange(nextHeaders)
    }

    onTab(row, col, e) {
        const headers = this.props.message.headers

        if (row !== headers.length - 1 || col !== 1) {
            return
        }

        e.preventDefault()

        const nextHeaders = _.cloneDeep(this.props.message.headers)
        nextHeaders.push(['Name', 'Value'])
        this.props.onChange(nextHeaders)
        this._nextSel = `${row + 1}-key`
    }

    componentDidUpdate() {
        if (this._nextSel && this.refs[this._nextSel]) {
            this.refs[this._nextSel].focus()
            this._nextSel = undefined
        }
    }

    onRemove(row, col, e) {
        if (col === 1) {
            e.preventDefault()
            this.refs[`${row}-key`].focus()
        } else if (row > 0) {
            e.preventDefault()
            this.refs[`${row - 1}-value`].focus()
        }
    }

    render() {
        const { message, edit } = this.props

        return (
            <table className="header-table">
                <tbody>
                    {message.headers.map((header, i) => (
                        <tr key={i}>
                            <td className="header-name">
                                <HeaderEditor
                                    ref={FocusHelper(i === 0 && 'headers' === edit)}
                                    content={header[0]}
                                    onDone={val => this.onChange(i, 0, val)}
                                    onRemove={event => this.onRemove(i, 0, event)}
                                    onTab={event => this.onTab(i, 0, event)}
                                />:
                            </td>
                            <td className="header-value">
                                <HeaderEditor
                                    ref={`${i}-value`}
                                    content={header[1]}
                                    onDone={val => this.onChange(i, 1, val)}
                                    onRemove={event => this.onRemove(i, 1, event)}
                                    onTab={event => this.onTab(i, 1, event)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}
