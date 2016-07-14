import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import { RequestUtils, isValidHttpVersion, parseUrl, parseHttpVersion } from '../../flow/utils.js'
import { Key, formatTimeStamp } from '../../utils.js'
import ContentView from '../ContentView'
import ValueEditor from '../ValueEditor'
import Headers from './Headers'
import FocusHelper from '../helpers/Focus'

class RequestLine extends Component {

    render() {
        const { flow, updateFlow, edit } = this.props

        return (
            <div className="first-line request-line">
                <ValueEditor
                    ref={FocusHelper('method' === edit)}
                    content={flow.request.method}
                    onDone={method => updateFlow({ request: { method } })}
                    inline
                />
                &nbsp;
                <ValueEditor
                    ref={FocusHelper('url' === edit)}
                    content={RequestUtils.pretty_url(flow.request)}
                    onDone={url => updateFlow({ request: Object.assign({ path: '' }, parseUrl(url)) })}
                    isValid={url => !!parseUrl(url).host}
                    inline
                />
                &nbsp;
                <ValueEditor
                    ref={FocusHelper('httpVersion' === edit)}
                    content={flow.request.http_version}
                    onDone={ver => updateFlow({ request: { http_version: parseHttpVersion(ver) } })}
                    isValid={isValidHttpVersion}
                    inline
                />
            </div>
        )
    }
}

class ResponseLine extends Component {

    render() {
        const { flow, updateFlow, edit } = this.props

        return (
            <div className="first-line response-line">
                <ValueEditor
                    ref={FocusHelper('httpVersion' === edit)}
                    content={flow.response.http_version}
                    onDone={nextVer => updateFlow({ response: { http_version: parseHttpVersion(nextVer) } })}
                    isValid={isValidHttpVersion}
                    inline
                />
                &nbsp;
                <ValueEditor
                    ref={FocusHelper('code' === edit)}
                    content={flow.response.status_code + ''}
                    onDone={code => updateFlow({ response: { code: parseInt(code) } })}
                    isValid={code => /^\d+$/.test(code)}
                    inline
                />
                &nbsp;
                <ValueEditor
                    ref={FocusHelper('msg' === edit)}
                    content={flow.response.reason}
                    onDone={msg => updateFlow({ response: { msg } })}
                    inline
                />
            </div>
        )
    }
}

export class Request extends Component {

    static keys = {
        m: 'method',
        u: 'url',
        v: 'httpVersion',
        h: 'headers'
    }

    render() {
        const { flow, updateFlow, edit } = this.props

        return (
            <section className="request">
                <RequestLine ref="requestLine" flow={flow} updateFlow={updateFlow} edit={Request.keys[edit]} />
                <Headers
                    ref="headers"
                    message={flow.request}
                    onChange={headers => updateFlow({ request: { headers } })}
                    edit={Request.keys[edit]}
                />
                <hr/>
                <ContentView flow={flow} message={flow.request}/>
            </section>
        )
    }
}

export class Response extends Component {

    static keys = {
        c: 'status_code',
        m: 'msg',
        v: 'httpVersion',
        h: 'headers'
    }

    render() {
        const { flow, updateFlow, edit } = this.props

        return (
            <section className="response">
                <ResponseLine ref="responseLine" flow={flow} updateFlow={updateFlow} edit={Response.keys[edit]} />
                <Headers
                    ref="headers"
                    message={flow.response}
                    onChange={headers => updateFlow({ response: { headers } })}
                    edit={Response.keys[edit]}
                />
                <hr/>
                <ContentView flow={flow} message={flow.response}/>
            </section>
        )
    }
}

ErrorView.propTypes = {
    flow: PropTypes.object.isRequired,
}

export function ErrorView({ flow }) {
    return (
        <section>
            <div className="alert alert-warning">
                {flow.error.msg}
                <div>
                    <small>{formatTimeStamp(flow.error.timestamp)}</small>
                </div>
            </div>
        </section>
    )
}
