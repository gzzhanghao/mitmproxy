import ReactDOM from 'react-dom'

export default shouldFocus => {
    if (!shouldFocus) {
        return () => {}
    }
    return ref => {
        if(ref) {
            ReactDOM.findDOMNode(ref).select()
        }
    }
}
