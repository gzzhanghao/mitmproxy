import ReactDOM from 'react-dom'

export default shouldFocus => {
    if (!shouldFocus) {
        return () => {}
    }
    return ref => {
        if(ref) {
            let node = ReactDOM.findDOMNode(ref)
            if(node.select) {
                node.select()
            } else {
                node.focus()
            }
        }
    }
}
