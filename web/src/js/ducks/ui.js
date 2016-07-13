import {SELECT} from "./views/main"

export const SET_ACTIVE_MENU = 'SET_ACTIVE_MENU';
export const SET_SELECTED_INPUT = 'SET_SELECTED_INPUT'
export const UPDATE_QUERY = 'UPDATE_QUERY'
export const SET_PANEL = 'SET_PANEL'
export const SET_PROMPT_OPEN = 'SET_PROMPT_OPEN'

const defaultState = {
    activeMenu: 'Start',
    selectedInput: null,
    query: {},
    panel: 'request',
    promptOpen: false
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

export function setPromptOpen(promptOpen) {
    return { type: SET_PROMPT_OPEN, promptOpen }
}
