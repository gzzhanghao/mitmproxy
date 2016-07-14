import {SELECT} from "./views/main"

export const SET_ACTIVE_MENU = 'SET_ACTIVE_MENU';
export const SET_SELECTED_INPUT = 'SET_SELECTED_INPUT'
export const UPDATE_QUERY = 'UPDATE_QUERY'
export const SET_PANEL = 'SET_PANEL'
export const OPEN_PROMPT = 'OPEN_PROMPT'
export const CLOSE_PROMPT = 'CLOSE_PROMPT'
export const SET_EDIT_TYPE = 'SET_EDIT_TYPE'

const defaultState = {
    activeMenu: 'Start',
    selectedInput: null,
    query: {},
    panel: 'request',
    prompt: false,
    editType: null
}

const promptOptions = {
    request: [
        'method',
        'url',
        { text: 'http version', key: 'v' },
        'header'
    ],
    response: [
        { text: 'http version', key: 'v' },
        'code',
        'message',
        'header'
    ]
}

export default function reduce(state = defaultState, action) {
    switch (action.type) {
        case SET_ACTIVE_MENU:
            return {
                ...state,
                activeMenu: action.activeMenu
            }

        case SELECT:
            let isNewSelect = (action.flowId && !action.currentSelection)
            let isDeselect = (!action.flowId && action.currentSelection)
            if(isNewSelect) {
                return {
                    ...state,
                    activeMenu: "Flow"
                }
            }
            if(isDeselect && state.activeMenu === "Flow") {
                return {
                    ...state,
                    activeMenu: "Start"
                }
            }
            return state

        case SET_SELECTED_INPUT:
            return {
                ...state,
                activeMenu: action.input === null ? state.activeMenu : 'Start',
                selectedInput: action.input
            }

        case UPDATE_QUERY:
            return {
                ...state,
                query: { ...state.query, ...action.query }
            }

        case SET_PANEL:
            return {
                ...state,
                panel: action.panel
            }

        case OPEN_PROMPT:
            return {
                ...state,
                prompt: promptOptions[state.panel] || false
            }

        case CLOSE_PROMPT:
            return {
                ...state,
                prompt: false
            }

        case SET_EDIT_TYPE:
            return {
                ...state,
                editType: action.editType
            }

        default:
            return state
    }
}

export function setActiveMenu(activeMenu) {
    return { type: SET_ACTIVE_MENU, activeMenu }
}

export function setSelectedInput(input) {
    return { type: SET_SELECTED_INPUT, input }
}

export function updateQuery(query) {
    return { type: UPDATE_QUERY, query }
}

export function setPanel(panel) {
    return { type: SET_PANEL, panel }
}

export function setPanelRelative(shift, selectedPanel, selectedFlow) {
    if (!selectedFlow) {
        return () => {}
    }
    const panels = ['request', 'response', 'error'].filter(k => selectedFlow[k]).concat(['details'])
    return setPanel(panels[(panels.indexOf(selectedPanel) + shift + panels.length) % panels.length])
}

export function openPrompt() {
    return { type: OPEN_PROMPT }
}

export function closePrompt() {
    return { type: CLOSE_PROMPT }
}

export function setEditType(editType) {
    return { type: SET_EDIT_TYPE, editType }
}
