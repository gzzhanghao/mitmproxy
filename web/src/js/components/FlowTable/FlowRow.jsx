import React, { PropTypes } from 'react'
import classnames from 'classnames'
import columns from './FlowColumns'
import { pure } from '../../utils'
import { ContextMenu, MenuItem, ContextMenuLayer } from 'react-contextmenu'

FlowRow.propTypes = {
    onSelect: PropTypes.func.isRequired,
    flow: PropTypes.object.isRequired,
    highlighted: PropTypes.bool,
    selected: PropTypes.bool,
}

function FlowRow({ flow, selected, highlighted, onSelect }) {
    const className = classnames({
        'selected': selected,
        'highlighted': highlighted,
        'intercepted': flow.intercepted,
        'has-request': flow.request,
        'has-response': flow.response,
    })

    const ContextMenuLayerContainer = ContextMenuLayer(flow.id)(() => (
        <div>Helloworld</div>
    ))

    const FlowContextMenu = () => (
        <ContextMenu identifier={flow.id}>
            <MenuItem data={'some-data'} onClick={() => {
                console.log('clicked')
            }}>
                ContextMenu Item 1
            </MenuItem>
        </ContextMenu>
    )

    return (
        <tr className={className} onClick={() => onSelect(flow.id)}>
            {columns.map(Column => (
                <Column key={Column.name} flow={flow}/>
            ))}
            <td>
                <ContextMenuLayerContainer />
                <FlowContextMenu />
            </td>
        </tr>
    )
}

export default pure(FlowRow)
