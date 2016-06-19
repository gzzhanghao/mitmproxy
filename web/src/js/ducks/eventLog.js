import makeList from './utils/list'
import {updateViewFilter, updateViewList} from './utils/view'

import {fetchApi, reduceList} from '../utils'

const TOGGLE_FILTER = 'TOGGLE_EVENTLOG_FILTER'
const TOGGLE_VISIBILITY = 'TOGGLE_EVENTLOG_VISIBILITY'
export const UPDATE_LOG = 'UPDATE_EVENTLOG'

const defaultState = {
    visible: false,
    filter: {
        "debug": false,
        "info": true,
        "web": true
    },
    events: reduceList(),
    filteredEvents: [],
}

export default function reduce(state = defaultState, action) {
    switch (action.type) {
        case TOGGLE_FILTER:
            const filter = {
                ...state.filter,
                [action.filter]: !state.filter[action.filter]
            }
            return {
                ...state,
                filter,
                filteredEvents: updateViewFilter(
                    state.events,
                    x => filter[x.level]
                )
            }
        case TOGGLE_VISIBILITY:
            return {
                ...state,
                visible: !state.visible
            }
        case UPDATE_LOG:
            const events = reduceList(UPDATE_LOG, state.events, action)
            return {
                ...state,
                events,
                filteredEvents: updateViewList(
                    state.filteredEvents,
                    state.events,
                    events,
                    action,
                    x => state.filter[x.level]
                )
            }
        default:
            return state
    }
}


export function toggleEventLogFilter(filter) {
    return {type: TOGGLE_FILTER, filter}
}

export function toggleEventLogVisibility() {
    return {type: TOGGLE_VISIBILITY}
}

function addItem(item) {
    return {
        type: UPDATE_LOG,
        cmd: ADD,
        item
    }
}

function updateItem(item) {
    return {
        type: UPDATE_LOG,
        cmd: UPDATE,
        item
    }
}

function removeItem(item) {
    return {
        type: UPDATE_LOG,
        cmd: REMOVE,
        item
    }
}


function updateList(event) {
    /* This action creater takes all WebSocket events */
    return dispatch => {
        switch (event.cmd) {
            case "add":
                return dispatch(addItem(event.data))
            case "update":
                return dispatch(updateItem(event.data))
            case "remove":
                return dispatch(removeItem(event.data))
            case "reset":
                return dispatch(fetchList())
            default:
                console.error("unknown list update", event)
        }
    }
}

function requestList() {
    return {
        type: UPDATE_LOG,
        cmd: REQUEST_LIST,
    }
}

function receiveList(list) {
    return {
        type: UPDATE_LOG,
        cmd: RECEIVE_LIST,
        list
    }
}

function fetchList() {
    return dispatch => {

        dispatch(requestList())

        return fetchApi("/events").then(response => {
            return response.json().then(json => {
                dispatch(receiveList(json.data))
            })
        })
    }
}

let id = 0
export function addLogEntry(message, level = "web") {
    return addItem({
        message,
        level,
        id: `log-${id++}`
    })
}
export {updateList as updateLogEntries, fetchList as fetchLogEntries}
