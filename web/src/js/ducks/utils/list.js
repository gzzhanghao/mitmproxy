import {fetchApi} from "../../utils"

export const ADD = "ADD"
export const UPDATE = "UPDATE"
export const REMOVE = "REMOVE"
export const REQUEST_LIST = "REQUEST_LIST"
export const RECEIVE_LIST = "RECEIVE_LIST"


const defaultState = {
    list: [],
    isFetching: false,
    actionsDuringFetch: [],
    byId: {},
    indexOf: {},
}

function reduceList(actionType, state = defaultState, action = {}) {

    if (action.type !== actionType) {
        return state
    }

    // Handle cases where we finished fetching or are still fetching.
    if (action.cmd === RECEIVE_LIST) {
        let s = {
            isFetching: false,
            actionsDuringFetch: [],
            list: action.list,
            byId: {},
            indexOf: {}
        }
        for (let i = 0; i < action.list.length; i++) {
            let item = action.list[i]
            s.byId[item.id] = item
            s.indexOf[item.id] = i
        }
        for (action of state.actionsDuringFetch) {
            s = reduceList(actionType, s, action)
        }
        return s
    } else if (state.isFetching) {
        return {
            ...state,
            actionsDuringFetch: [...state.actionsDuringFetch, action]
        }
    }

    let list, itemIndex
    switch (action.cmd) {
        case ADD:
            return {
                list: [...state.list, action.item],
                byId: {...state.byId, [action.item.id]: action.item},
                indexOf: {...state.indexOf, [action.item.id]: state.list.length},
            }

        case UPDATE:

            list = [...state.list]
            itemIndex = state.indexOf[action.item.id]
            list[itemIndex] = action.item
            return {
                ...state,
                list,
                byId: {...state.byId, [action.item.id]: action.item},
            }

        case REMOVE:
            list = [...state.list]
            itemIndex = state.indexOf[action.item.id]
            list.splice(itemIndex, 1)
            return {
                ...state,
                list,
                byId: {...state.byId, [action.item.id]: undefined},
                indexOf: {...state.indexOf, [action.item.id]: undefined},
            }

        case REQUEST_LIST:
            return {
                ...state,
                isFetching: true
            }

        default:
            console.debug("unknown action", action)
            return state
    }
}

