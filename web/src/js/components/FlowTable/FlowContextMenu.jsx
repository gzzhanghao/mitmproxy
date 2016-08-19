import { connect } from 'react-redux'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import * as flowsActions from '../../ducks/flows'
import { MessageUtils } from '../../flow/utils.js'

function FlowContextMenu({ flow, acceptFlow, replayFlow, duplicateFlow, removeFlow, revertFlow }) {
    return (
        <ContextMenu identifier={`context-menu-${flow.id}`}>
            <MenuItem onClick={() => acceptFlow(flow)}>Accept</MenuItem>
            <MenuItem onClick={() => replayFlow(flow)}>Replay</MenuItem>
            <MenuItem onClick={() => duplicateFlow(flow)}>Duplicate</MenuItem>
            <MenuItem onClick={() => removeFlow(flow)}>Delete</MenuItem>
            <MenuItem onClick={() => revertFlow(flow)}>Revert</MenuItem>
            <MenuItem onClick={() => window.location = MessageUtils.getContentURL(flow, flow.response)}>Download</MenuItem>
        </ContextMenu>
    )
}

export default connect(
    state => ({}),
    {
        acceptFlow: flowsActions.accept,
        replayFlow: flowsActions.replay,
        duplicateFlow: flowsActions.duplicate,
        removeFlow: flowsActions.remove,
        revertFlow: flowsActions.revert,
    }
)(FlowContextMenu)
