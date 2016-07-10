(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Query = exports.ConnectionActions = exports.StoreCmds = exports.ActionTypes = undefined;

var _dispatcher = require("./dispatcher.js");

var ActionTypes = exports.ActionTypes = {
    // Connection
    CONNECTION_OPEN: "connection_open",
    CONNECTION_CLOSE: "connection_close",
    CONNECTION_ERROR: "connection_error",

    // Stores
    SETTINGS_STORE: "settings",
    EVENT_STORE: "events",
    FLOW_STORE: "flows"
};

var StoreCmds = exports.StoreCmds = {
    ADD: "add",
    UPDATE: "update",
    REMOVE: "remove",
    RESET: "reset"
};

var ConnectionActions = exports.ConnectionActions = {
    open: function open() {
        _dispatcher.AppDispatcher.dispatchViewAction({
            type: ActionTypes.CONNECTION_OPEN
        });
    },
    close: function close() {
        _dispatcher.AppDispatcher.dispatchViewAction({
            type: ActionTypes.CONNECTION_CLOSE
        });
    },
    error: function error() {
        _dispatcher.AppDispatcher.dispatchViewAction({
            type: ActionTypes.CONNECTION_ERROR
        });
    }
};

var Query = exports.Query = {
    SEARCH: "s",
    HIGHLIGHT: "h",
    SHOW_EVENTLOG: "e"
};

},{"./dispatcher.js":41}],3:[function(require,module,exports){
(function (process){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reactRouter = require('react-router');

var _ProxyApp = require('./components/ProxyApp');

var _ProxyApp2 = _interopRequireDefault(_ProxyApp);

var _MainView = require('./components/MainView');

var _MainView2 = _interopRequireDefault(_MainView);

var _index = require('./ducks/index');

var _index2 = _interopRequireDefault(_index);

var _eventLog = require('./ducks/eventLog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middlewares = [_reduxThunk2.default];

if (process.env.NODE_ENV === 'development') {
    var createLogger = require('redux-logger');
    middlewares.push(createLogger());
}

// logger must be last
var store = (0, _redux.createStore)(_index2.default, _redux.applyMiddleware.apply(undefined, middlewares));

// @todo move to ProxyApp
window.addEventListener('error', function (msg) {
    store.dispatch((0, _eventLog.add)(msg));
});

// @todo remove this
document.addEventListener('DOMContentLoaded', function () {
    (0, _reactDom.render)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
            _reactRouter.Router,
            { history: _reactRouter.hashHistory },
            _react2.default.createElement(_reactRouter.Redirect, { from: '/', to: '/flows' }),
            _react2.default.createElement(
                _reactRouter.Route,
                { path: '/', component: _ProxyApp2.default },
                _react2.default.createElement(_reactRouter.Route, { path: 'flows', component: _MainView2.default }),
                _react2.default.createElement(_reactRouter.Route, { path: 'flows/:flowId/:detailTab', component: _MainView2.default })
            )
        )
    ), document.getElementById("mitmproxy"));
});

}).call(this,require('_process'))

},{"./components/MainView":29,"./components/ProxyApp":31,"./ducks/eventLog":43,"./ducks/index":45,"_process":1,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux":"redux","redux-logger":"redux-logger","redux-thunk":"redux-thunk"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../flow/utils.js');

var _ContentViews = require('./ContentView/ContentViews');

var _MetaViews = require('./ContentView/MetaViews');

var MetaViews = _interopRequireWildcard(_MetaViews);

var _ContentLoader = require('./ContentView/ContentLoader');

var _ContentLoader2 = _interopRequireDefault(_ContentLoader);

var _ViewSelector = require('./ContentView/ViewSelector');

var _ViewSelector2 = _interopRequireDefault(_ViewSelector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContentView = function (_Component) {
    _inherits(ContentView, _Component);

    function ContentView(props, context) {
        _classCallCheck(this, ContentView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContentView).call(this, props, context));

        _this.state = { displayLarge: false, View: _ContentViews.ViewAuto };
        _this.selectView = _this.selectView.bind(_this);
        return _this;
    }

    _createClass(ContentView, [{
        key: 'selectView',
        value: function selectView(View) {
            this.setState({ View: View });
        }
    }, {
        key: 'displayLarge',
        value: function displayLarge() {
            this.setState({ displayLarge: true });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.message !== this.props.message) {
                this.setState({ displayLarge: false, View: _ContentViews.ViewAuto });
            }
        }
    }, {
        key: 'isContentTooLarge',
        value: function isContentTooLarge(msg) {
            return msg.contentLength > 1024 * 1024 * (_ContentViews.ViewImage.matches(msg) ? 10 : 0.2);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var flow = _props.flow;
            var message = _props.message;
            var _state = this.state;
            var displayLarge = _state.displayLarge;
            var View = _state.View;


            if (message.contentLength === 0) {
                return _react2.default.createElement(MetaViews.ContentEmpty, this.props);
            }

            if (message.contentLength === null) {
                return _react2.default.createElement(MetaViews.ContentMissing, this.props);
            }

            if (!displayLarge && this.isContentTooLarge(message)) {
                return _react2.default.createElement(MetaViews.ContentTooLarge, _extends({}, this.props, { onClick: this.displayLarge }));
            }

            return _react2.default.createElement(
                'div',
                null,
                View.textView ? _react2.default.createElement(
                    _ContentLoader2.default,
                    { flow: flow, message: message },
                    _react2.default.createElement(this.state.View, { content: '' })
                ) : _react2.default.createElement(View, { flow: flow, message: message }),
                _react2.default.createElement(
                    'div',
                    { className: 'view-options text-center' },
                    _react2.default.createElement(_ViewSelector2.default, { onSelectView: this.selectView, active: View, message: message }),
                    ' ',
                    _react2.default.createElement(
                        'a',
                        { className: 'btn btn-default btn-xs', href: _utils.MessageUtils.getContentURL(flow, message) },
                        _react2.default.createElement('i', { className: 'fa fa-download' })
                    )
                )
            );
        }
    }]);

    return ContentView;
}(_react.Component);

ContentView.propTypes = {
    // It may seem a bit weird at the first glance:
    // Every view takes the flow and the message as props, e.g.
    // <Auto flow={flow} message={flow.request}/>
    flow: _react2.default.PropTypes.object.isRequired,
    message: _react2.default.PropTypes.object.isRequired
};
exports.default = ContentView;

},{"../flow/utils.js":55,"./ContentView/ContentLoader":5,"./ContentView/ContentViews":6,"./ContentView/MetaViews":7,"./ContentView/ViewSelector":8,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../../flow/utils.js');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// This is the only place where we use jQuery.
// Remove when possible.


var ContentLoader = function (_Component) {
    _inherits(ContentLoader, _Component);

    function ContentLoader(props, context) {
        _classCallCheck(this, ContentLoader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContentLoader).call(this, props, context));

        _this.state = { content: null, request: null };
        return _this;
    }

    _createClass(ContentLoader, [{
        key: 'requestContent',
        value: function requestContent(nextProps) {
            var _this2 = this;

            if (this.state.request) {
                this.state.request.abort();
            }

            var requestUrl = _utils.MessageUtils.getContentURL(nextProps.flow, nextProps.message);
            var request = _jquery2.default.get(requestUrl);

            this.setState({ content: null, request: request });

            request.done(function (content) {
                _this2.setState({ content: content });
            }).fail(function (xhr, textStatus, errorThrown) {
                if (textStatus === 'abort') {
                    return;
                }
                _this2.setState({ content: 'AJAX Error: ' + textStatus + '\r\n' + errorThrown });
            }).always(function () {
                _this2.setState({ request: null });
            });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.requestContent(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.message !== this.props.message) {
                this.requestContent(nextProps);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.state.request) {
                this.state.request.abort();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return this.state.content ? _react2.default.cloneElement(this.props.children, {
                content: this.state.content
            }) : _react2.default.createElement(
                'div',
                { className: 'text-center' },
                _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' })
            );
        }
    }]);

    return ContentLoader;
}(_react.Component);

ContentLoader.propTypes = {
    flow: _react.PropTypes.object.isRequired,
    message: _react.PropTypes.object.isRequired
};
exports.default = ContentLoader;

},{"../../flow/utils.js":55,"jquery":"jquery","react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ViewImage = ViewImage;
exports.ViewRaw = ViewRaw;
exports.ViewJSON = ViewJSON;
exports.ViewAuto = ViewAuto;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ContentLoader = require('./ContentLoader');

var _ContentLoader2 = _interopRequireDefault(_ContentLoader);

var _utils = require('../../flow/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var views = [ViewAuto, ViewImage, ViewJSON, ViewRaw];

ViewImage.regex = /^image\/(png|jpe?g|gif|vnc.microsoft.icon|x-icon)$/i;
ViewImage.matches = function (msg) {
    return ViewImage.regex.test(_utils.MessageUtils.getContentType(msg));
};

ViewImage.propTypes = {
    flow: _react.PropTypes.object.isRequired,
    message: _react.PropTypes.object.isRequired
};

function ViewImage(_ref) {
    var flow = _ref.flow;
    var message = _ref.message;

    return _react2.default.createElement(
        'div',
        { className: 'flowview-image' },
        _react2.default.createElement('img', { src: _utils.MessageUtils.getContentURL(flow, message), alt: 'preview', className: 'img-thumbnail' })
    );
}

ViewRaw.textView = true;
ViewRaw.matches = function () {
    return true;
};

ViewRaw.propTypes = {
    content: _react2.default.PropTypes.string.isRequired
};

function ViewRaw(_ref2) {
    var content = _ref2.content;

    return _react2.default.createElement(
        'pre',
        null,
        content
    );
}

ViewJSON.textView = true;
ViewJSON.regex = /^application\/json$/i;
ViewJSON.matches = function (msg) {
    return ViewJSON.regex.test(_utils.MessageUtils.getContentType(msg));
};

ViewJSON.propTypes = {
    content: _react2.default.PropTypes.string.isRequired
};

function ViewJSON(_ref3) {
    var content = _ref3.content;

    var json = content;
    try {
        json = JSON.stringify(JSON.parse(content), null, 2);
    } catch (e) {
        // @noop
    }
    return _react2.default.createElement(
        'pre',
        null,
        json
    );
}

ViewAuto.matches = function () {
    return false;
};
ViewAuto.findView = function (msg) {
    return views.find(function (v) {
        return v.matches(msg);
    }) || views[views.length - 1];
};

ViewAuto.propTypes = {
    message: _react2.default.PropTypes.object.isRequired,
    flow: _react2.default.PropTypes.object.isRequired
};

function ViewAuto(_ref4) {
    var message = _ref4.message;
    var flow = _ref4.flow;

    var View = ViewAuto.findView(message);
    if (View.textView) {
        return _react2.default.createElement(
            _ContentLoader2.default,
            { message: message, flow: flow },
            _react2.default.createElement(View, { content: '' })
        );
    } else {
        return _react2.default.createElement(View, { message: message, flow: flow });
    }
}

exports.default = views;

},{"../../flow/utils.js":55,"./ContentLoader":5,"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContentEmpty = ContentEmpty;
exports.ContentMissing = ContentMissing;
exports.ContentTooLarge = ContentTooLarge;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ContentEmpty(_ref) {
    var flow = _ref.flow;
    var message = _ref.message;

    return _react2.default.createElement(
        'div',
        { className: 'alert alert-info' },
        'No ',
        flow.request === message ? 'request' : 'response',
        ' content.'
    );
}

function ContentMissing(_ref2) {
    var flow = _ref2.flow;
    var message = _ref2.message;

    return _react2.default.createElement(
        'div',
        { className: 'alert alert-info' },
        flow.request === message ? 'Request' : 'Response',
        ' content missing.'
    );
}

function ContentTooLarge(_ref3) {
    var message = _ref3.message;
    var onClick = _ref3.onClick;

    return _react2.default.createElement(
        'div',
        { className: 'alert alert-warning' },
        _react2.default.createElement(
            'button',
            { onClick: onClick, className: 'btn btn-xs btn-warning pull-right' },
            'Display anyway'
        ),
        (0, _utils.formatSize)(message.contentLength),
        ' content size.'
    );
}

},{"../../utils.js":56,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ViewSelector;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ContentViews = require('./ContentViews');

var _ContentViews2 = _interopRequireDefault(_ContentViews);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ViewSelector.propTypes = {
    active: _react.PropTypes.func.isRequired,
    message: _react.PropTypes.object.isRequired,
    onSelectView: _react.PropTypes.func.isRequired
};

function ViewSelector(_ref) {
    var active = _ref.active;
    var message = _ref.message;
    var onSelectView = _ref.onSelectView;

    return _react2.default.createElement(
        'div',
        { className: 'view-selector btn-group btn-group-xs' },
        _ContentViews2.default.map(function (View) {
            return _react2.default.createElement(
                'button',
                {
                    key: View.name,
                    onClick: function onClick() {
                        return onSelectView(View);
                    },
                    className: (0, _classnames2.default)('btn btn-default', { active: View === active }) },
                View === _ContentViews.ViewAuto ? 'auto: ' + _ContentViews.ViewAuto.findView(message).name.toLowerCase().replace('view', '') : View.name.toLowerCase().replace('view', '')
            );
        })
    );
}

},{"./ContentViews":6,"classnames":"classnames","react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _eventLog = require('../ducks/eventLog');

var _ToggleButton = require('./common/ToggleButton');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _EventList = require('./EventLog/EventList');

var _EventList2 = _interopRequireDefault(_EventList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventLog = function (_Component) {
    _inherits(EventLog, _Component);

    function EventLog(props, context) {
        _classCallCheck(this, EventLog);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventLog).call(this, props, context));

        _this.state = { height: _this.props.defaultHeight };

        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDragMove = _this.onDragMove.bind(_this);
        _this.onDragStop = _this.onDragStop.bind(_this);
        return _this;
    }

    _createClass(EventLog, [{
        key: 'onDragStart',
        value: function onDragStart(event) {
            event.preventDefault();
            this.dragStart = this.state.height + event.pageY;
            window.addEventListener('mousemove', this.onDragMove);
            window.addEventListener('mouseup', this.onDragStop);
            window.addEventListener('dragend', this.onDragStop);
        }
    }, {
        key: 'onDragMove',
        value: function onDragMove(event) {
            event.preventDefault();
            this.setState({ height: this.dragStart - event.pageY });
        }
    }, {
        key: 'onDragStop',
        value: function onDragStop(event) {
            event.preventDefault();
            window.removeEventListener('mousemove', this.onDragMove);
        }
    }, {
        key: 'render',
        value: function render() {
            var height = this.state.height;
            var _props = this.props;
            var filters = _props.filters;
            var events = _props.events;
            var toggleFilter = _props.toggleFilter;
            var close = _props.close;


            return _react2.default.createElement(
                'div',
                { className: 'eventlog', style: { height: height } },
                _react2.default.createElement(
                    'div',
                    { onMouseDown: this.onDragStart },
                    'Eventlog',
                    _react2.default.createElement(
                        'div',
                        { className: 'pull-right' },
                        ['debug', 'info', 'web'].map(function (type) {
                            return _react2.default.createElement(_ToggleButton2.default, { key: type, text: type, checked: filters[type], onToggle: function onToggle() {
                                    return toggleFilter(type);
                                } });
                        }),
                        _react2.default.createElement('i', { onClick: close, className: 'fa fa-close' })
                    )
                ),
                _react2.default.createElement(_EventList2.default, { events: events })
            );
        }
    }]);

    return EventLog;
}(_react.Component);

EventLog.propTypes = {
    filters: _react.PropTypes.object.isRequired,
    events: _react.PropTypes.array.isRequired,
    toggleFilter: _react.PropTypes.func.isRequired,
    close: _react.PropTypes.func.isRequired,
    defaultHeight: _react.PropTypes.number
};
EventLog.defaultProps = {
    defaultHeight: 200
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        filters: state.eventLog.filters,
        events: state.eventLog.view.data
    };
}, {
    close: _eventLog.toggleVisibility,
    toggleFilter: _eventLog.toggleFilter
})(EventLog);

},{"../ducks/eventLog":43,"./EventLog/EventList":10,"./common/ToggleButton":37,"react":"react","react-redux":"react-redux"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _AutoScroll = require('../helpers/AutoScroll');

var _AutoScroll2 = _interopRequireDefault(_AutoScroll);

var _VirtualScroll = require('../helpers/VirtualScroll');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventLogList = function (_Component) {
    _inherits(EventLogList, _Component);

    function EventLogList(props) {
        _classCallCheck(this, EventLogList);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventLogList).call(this, props));

        _this.heights = {};
        _this.state = { vScroll: (0, _VirtualScroll.calcVScroll)() };

        _this.onViewportUpdate = _this.onViewportUpdate.bind(_this);
        return _this;
    }

    _createClass(EventLogList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('resize', this.onViewportUpdate);
            this.onViewportUpdate();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.onViewportUpdate);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.onViewportUpdate();
        }
    }, {
        key: 'onViewportUpdate',
        value: function onViewportUpdate() {
            var _this2 = this;

            var viewport = _reactDom2.default.findDOMNode(this);

            var vScroll = (0, _VirtualScroll.calcVScroll)({
                itemCount: this.props.events.length,
                rowHeight: this.props.rowHeight,
                viewportTop: viewport.scrollTop,
                viewportHeight: viewport.offsetHeight,
                itemHeights: this.props.events.map(function (entry) {
                    return _this2.heights[entry.id];
                })
            });

            if (!(0, _shallowequal2.default)(this.state.vScroll, vScroll)) {
                this.setState({ vScroll: vScroll });
            }
        }
    }, {
        key: 'setHeight',
        value: function setHeight(id, node) {
            if (node && !this.heights[id]) {
                var height = node.offsetHeight;
                if (this.heights[id] !== height) {
                    this.heights[id] = height;
                    this.onViewportUpdate();
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var vScroll = this.state.vScroll;
            var events = this.props.events;


            return _react2.default.createElement(
                'pre',
                { onScroll: this.onViewportUpdate },
                _react2.default.createElement('div', { style: { height: vScroll.paddingTop } }),
                events.slice(vScroll.start, vScroll.end).map(function (event) {
                    return _react2.default.createElement(
                        'div',
                        { key: event.id, ref: function ref(node) {
                                return _this3.setHeight(event.id, node);
                            } },
                        _react2.default.createElement(LogIcon, { event: event }),
                        event.message
                    );
                }),
                _react2.default.createElement('div', { style: { height: vScroll.paddingBottom } })
            );
        }
    }]);

    return EventLogList;
}(_react.Component);

EventLogList.propTypes = {
    events: _react.PropTypes.array.isRequired,
    rowHeight: _react.PropTypes.number
};
EventLogList.defaultProps = {
    rowHeight: 18
};


function LogIcon(_ref) {
    var event = _ref.event;

    var icon = { web: 'html5', debug: 'bug' }[event.level] || 'info';
    return _react2.default.createElement('i', { className: 'fa fa-fw fa-' + icon });
}

exports.default = (0, _AutoScroll2.default)(EventLogList);

},{"../helpers/AutoScroll":39,"../helpers/VirtualScroll":40,"react":"react","react-dom":"react-dom","shallowequal":"shallowequal"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _AutoScroll = require('./helpers/AutoScroll');

var _AutoScroll2 = _interopRequireDefault(_AutoScroll);

var _VirtualScroll = require('./helpers/VirtualScroll');

var _FlowTableHead = require('./FlowTable/FlowTableHead');

var _FlowTableHead2 = _interopRequireDefault(_FlowTableHead);

var _FlowRow = require('./FlowTable/FlowRow');

var _FlowRow2 = _interopRequireDefault(_FlowRow);

var _filt = require('../filt/filt');

var _filt2 = _interopRequireDefault(_filt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowTable = function (_React$Component) {
    _inherits(FlowTable, _React$Component);

    function FlowTable(props, context) {
        _classCallCheck(this, FlowTable);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowTable).call(this, props, context));

        _this.state = { vScroll: (0, _VirtualScroll.calcVScroll)() };
        _this.onViewportUpdate = _this.onViewportUpdate.bind(_this);
        return _this;
    }

    _createClass(FlowTable, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            window.addEventListener('resize', this.onViewportUpdate);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.onViewportUpdate);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.onViewportUpdate();

            if (!this.shouldScrollIntoView) {
                return;
            }

            this.shouldScrollIntoView = false;

            var _props = this.props;
            var rowHeight = _props.rowHeight;
            var flows = _props.flows;
            var selected = _props.selected;

            var viewport = _reactDom2.default.findDOMNode(this);
            var head = _reactDom2.default.findDOMNode(this.refs.head);

            var headHeight = head ? head.offsetHeight : 0;

            var rowTop = flows.indexOf(selected) * rowHeight + headHeight;
            var rowBottom = rowTop + rowHeight;

            var viewportTop = viewport.scrollTop;
            var viewportHeight = viewport.offsetHeight;

            // Account for pinned thead
            if (rowTop - headHeight < viewportTop) {
                viewport.scrollTop = rowTop - headHeight;
            } else if (rowBottom > viewportTop + viewportHeight) {
                viewport.scrollTop = rowBottom - viewportHeight;
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selected && nextProps.selected !== this.props.selected) {
                this.shouldScrollIntoView = true;
            }
        }
    }, {
        key: 'onViewportUpdate',
        value: function onViewportUpdate() {
            var viewport = _reactDom2.default.findDOMNode(this);
            var viewportTop = viewport.scrollTop;

            var vScroll = (0, _VirtualScroll.calcVScroll)({
                viewportTop: viewportTop,
                viewportHeight: viewport.offsetHeight,
                itemCount: this.props.flows.length,
                rowHeight: this.props.rowHeight
            });

            if (this.state.viewportTop !== viewportTop || !(0, _shallowequal2.default)(this.state.vScroll, vScroll)) {
                this.setState({ vScroll: vScroll, viewportTop: viewportTop });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state;
            var vScroll = _state.vScroll;
            var viewportTop = _state.viewportTop;
            var _props2 = this.props;
            var flows = _props2.flows;
            var selected = _props2.selected;
            var highlight = _props2.highlight;

            var isHighlighted = highlight ? _filt2.default.parse(highlight) : function () {
                return false;
            };

            return _react2.default.createElement(
                'div',
                { className: 'flow-table', onScroll: this.onViewportUpdate },
                _react2.default.createElement(
                    'table',
                    null,
                    _react2.default.createElement(
                        'thead',
                        { ref: 'head', style: { transform: 'translateY(' + viewportTop + 'px)' } },
                        _react2.default.createElement(_FlowTableHead2.default, null)
                    ),
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _react2.default.createElement('tr', { style: { height: vScroll.paddingTop } }),
                        flows.slice(vScroll.start, vScroll.end).map(function (flow) {
                            return _react2.default.createElement(_FlowRow2.default, {
                                key: flow.id,
                                flow: flow,
                                selected: flow === selected,
                                highlighted: isHighlighted(flow),
                                onSelect: _this2.props.onSelect
                            });
                        }),
                        _react2.default.createElement('tr', { style: { height: vScroll.paddingBottom } })
                    )
                )
            );
        }
    }]);

    return FlowTable;
}(_react2.default.Component);

FlowTable.propTypes = {
    onSelect: _react.PropTypes.func.isRequired,
    flows: _react.PropTypes.array.isRequired,
    rowHeight: _react.PropTypes.number,
    highlight: _react.PropTypes.string,
    selected: _react.PropTypes.object
};
FlowTable.defaultProps = {
    rowHeight: 32
};
exports.default = (0, _AutoScroll2.default)(FlowTable);

},{"../filt/filt":54,"./FlowTable/FlowRow":13,"./FlowTable/FlowTableHead":14,"./helpers/AutoScroll":39,"./helpers/VirtualScroll":40,"react":"react","react-dom":"react-dom","shallowequal":"shallowequal"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TLSColumn = TLSColumn;
exports.IconColumn = IconColumn;
exports.PathColumn = PathColumn;
exports.MethodColumn = MethodColumn;
exports.StatusColumn = StatusColumn;
exports.SizeColumn = SizeColumn;
exports.TimeColumn = TimeColumn;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../../flow/utils.js');

var _utils2 = require('../../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TLSColumn(_ref) {
    var flow = _ref.flow;

    return _react2.default.createElement('td', { className: (0, _classnames2.default)('col-tls', flow.request.scheme === 'https' ? 'col-tls-https' : 'col-tls-http') });
}

TLSColumn.headerClass = 'col-tls';
TLSColumn.headerName = '';

function IconColumn(_ref2) {
    var flow = _ref2.flow;

    return _react2.default.createElement(
        'td',
        { className: 'col-icon' },
        _react2.default.createElement('div', { className: (0, _classnames2.default)('resource-icon', IconColumn.getIcon(flow)) })
    );
}

IconColumn.headerClass = 'col-icon';
IconColumn.headerName = '';

IconColumn.getIcon = function (flow) {
    if (!flow.response) {
        return 'resource-icon-plain';
    }

    var contentType = _utils.ResponseUtils.getContentType(flow.response) || '';

    // @todo We should assign a type to the flow somewhere else.
    if (flow.response.status_code === 304) {
        return 'resource-icon-not-modified';
    }
    if (300 <= flow.response.status_code && flow.response.status_code < 400) {
        return 'resource-icon-redirect';
    }
    if (contentType.indexOf('image') >= 0) {
        return 'resource-icon-image';
    }
    if (contentType.indexOf('javascript') >= 0) {
        return 'resource-icon-js';
    }
    if (contentType.indexOf('css') >= 0) {
        return 'resource-icon-css';
    }
    if (contentType.indexOf('html') >= 0) {
        return 'resource-icon-document';
    }

    return 'resource-icon-plain';
};

function PathColumn(_ref3) {
    var flow = _ref3.flow;

    return _react2.default.createElement(
        'td',
        { className: 'col-path' },
        flow.request.is_replay && _react2.default.createElement('i', { className: 'fa fa-fw fa-repeat pull-right' }),
        flow.intercepted && _react2.default.createElement('i', { className: 'fa fa-fw fa-pause pull-right' }),
        _utils.RequestUtils.pretty_url(flow.request)
    );
}

PathColumn.headerClass = 'col-path';
PathColumn.headerName = 'Path';

function MethodColumn(_ref4) {
    var flow = _ref4.flow;

    return _react2.default.createElement(
        'td',
        { className: 'col-method' },
        flow.request.method
    );
}

MethodColumn.headerClass = 'col-method';
MethodColumn.headerName = 'Method';

function StatusColumn(_ref5) {
    var flow = _ref5.flow;

    return _react2.default.createElement(
        'td',
        { className: 'col-status' },
        flow.response && flow.response.status_code
    );
}

StatusColumn.headerClass = 'col-status';
StatusColumn.headerName = 'Status';

function SizeColumn(_ref6) {
    var flow = _ref6.flow;

    return _react2.default.createElement(
        'td',
        { className: 'col-size' },
        (0, _utils2.formatSize)(SizeColumn.getTotalSize(flow))
    );
}

SizeColumn.getTotalSize = function (flow) {
    var total = flow.request.contentLength;
    if (flow.response) {
        total += flow.response.contentLength || 0;
    }
    return total;
};

SizeColumn.headerClass = 'col-size';
SizeColumn.headerName = 'Size';

function TimeColumn(_ref7) {
    var flow = _ref7.flow;

    return _react2.default.createElement(
        'td',
        { className: 'col-time' },
        flow.response ? (0, _utils2.formatTimeDelta)(1000 * (flow.response.timestamp_end - flow.request.timestamp_start)) : '...'
    );
}

TimeColumn.headerClass = 'col-time';
TimeColumn.headerName = 'Time';

exports.default = [TLSColumn, IconColumn, PathColumn, MethodColumn, StatusColumn, SizeColumn, TimeColumn];

},{"../../flow/utils.js":55,"../../utils.js":56,"classnames":"classnames","react":"react"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = FlowRow;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _FlowColumns = require('./FlowColumns');

var _FlowColumns2 = _interopRequireDefault(_FlowColumns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

FlowRow.propTypes = {
    onSelect: _react.PropTypes.func.isRequired,
    flow: _react.PropTypes.object.isRequired,
    highlighted: _react.PropTypes.bool,
    selected: _react.PropTypes.bool
};

function FlowRow(_ref) {
    var flow = _ref.flow;
    var selected = _ref.selected;
    var highlighted = _ref.highlighted;
    var onSelect = _ref.onSelect;

    var className = (0, _classnames2.default)({
        'selected': selected,
        'highlighted': highlighted,
        'intercepted': flow.intercepted,
        'has-request': flow.request,
        'has-response': flow.response
    });

    return _react2.default.createElement(
        'tr',
        { className: className, onClick: function onClick() {
                return onSelect(flow);
            } },
        _FlowColumns2.default.map(function (Column) {
            return _react2.default.createElement(Column, { key: Column.name, flow: flow });
        })
    );
}

},{"./FlowColumns":12,"classnames":"classnames","react":"react"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _FlowColumns = require('./FlowColumns');

var _FlowColumns2 = _interopRequireDefault(_FlowColumns);

var _main = require('../../ducks/views/main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

FlowTableHead.propTypes = {
    updateSort: _react.PropTypes.func.isRequired,
    sortDesc: _react2.default.PropTypes.bool.isRequired,
    sortColumn: _react2.default.PropTypes.string
};

function FlowTableHead(_ref) {
    var sortColumn = _ref.sortColumn;
    var sortDesc = _ref.sortDesc;
    var updateSort = _ref.updateSort;

    var sortType = sortDesc ? 'sort-desc' : 'sort-asc';

    return _react2.default.createElement(
        'tr',
        null,
        _FlowColumns2.default.map(function (Column) {
            return _react2.default.createElement(
                'th',
                { className: (0, _classnames2.default)(Column.headerClass, sortColumn === Column.name && sortType),
                    key: Column.name,
                    onClick: function onClick() {
                        return updateSort(Column.name, Column.name !== sortColumn ? false : !sortDesc);
                    } },
                Column.headerName
            );
        })
    );
}

exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        sortDesc: state.flows.views.main.sort.desc,
        sortColumn: state.flows.views.main.sort.column
    };
}, {
    updateSort: _main.updateSort
})(FlowTableHead);

},{"../../ducks/views/main":52,"./FlowColumns":12,"classnames":"classnames","react":"react","react-redux":"react-redux"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Nav = require('./FlowView/Nav');

var _Nav2 = _interopRequireDefault(_Nav);

var _Messages = require('./FlowView/Messages');

var _Details = require('./FlowView/Details');

var _Details2 = _interopRequireDefault(_Details);

var _Prompt = require('./Prompt');

var _Prompt2 = _interopRequireDefault(_Prompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowView = function (_Component) {
    _inherits(FlowView, _Component);

    function FlowView(props, context) {
        _classCallCheck(this, FlowView);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowView).call(this, props, context));

        _this.state = { prompt: false };

        _this.closePrompt = _this.closePrompt.bind(_this);
        _this.selectTab = _this.selectTab.bind(_this);
        return _this;
    }

    _createClass(FlowView, [{
        key: 'getTabs',
        value: function getTabs() {
            var _this2 = this;

            return ['request', 'response', 'error'].filter(function (k) {
                return _this2.props.flow[k];
            }).concat(['details']);
        }
    }, {
        key: 'nextTab',
        value: function nextTab(increment) {
            var tabs = this.getTabs();
            // JS modulo operator doesn't correct negative numbers, make sure that we are positive.
            this.selectTab(tabs[(tabs.indexOf(this.props.tab) + increment + tabs.length) % tabs.length]);
        }
    }, {
        key: 'selectTab',
        value: function selectTab(panel) {
            this.props.updateLocation('/flows/' + this.props.flow.id + '/' + panel);
        }
    }, {
        key: 'closePrompt',
        value: function closePrompt(edit) {
            this.setState({ prompt: false });
            if (edit && this.tabComponent) {
                this.tabComponent.edit(edit);
            }
        }
    }, {
        key: 'promptEdit',
        value: function promptEdit() {
            var options = void 0;

            switch (this.props.tab) {

                case 'request':
                    options = ['method', 'url', { text: 'http version', key: 'v' }, 'header'];
                    break;

                case 'response':
                    options = [{ text: 'http version', key: 'v' }, 'code', 'message', 'header'];
                    break;

                case 'details':
                    return;

                default:
                    throw 'Unknown tab for edit: ' + this.props.tab;
            }

            this.setState({ prompt: { options: options, done: this.closePrompt } });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var tabs = this.getTabs();
            var _props = this.props;
            var flow = _props.flow;
            var active = _props.tab;
            var updateFlow = _props.updateFlow;


            if (tabs.indexOf(active) < 0) {
                if (active === 'response' && flow.error) {
                    active = 'error';
                } else if (active === 'error' && flow.response) {
                    active = 'response';
                } else {
                    active = tabs[0];
                }
            }

            var Tab = FlowView.allTabs[_lodash2.default.capitalize(active)];

            return _react2.default.createElement(
                'div',
                { className: 'flow-detail', onScroll: this.adjustHead },
                _react2.default.createElement(_Nav2.default, {
                    flow: flow,
                    tabs: tabs,
                    active: active,
                    onSelectTab: this.selectTab
                }),
                _react2.default.createElement(Tab, { ref: function ref(tab) {
                        return _this3.tabComponent = tab;
                    }, flow: flow, updateFlow: updateFlow }),
                this.state.prompt && _react2.default.createElement(_Prompt2.default, this.state.prompt)
            );
        }
    }]);

    return FlowView;
}(_react.Component);

FlowView.allTabs = { Request: _Messages.Request, Response: _Messages.Response, Error: _Messages.ErrorView, Details: _Details2.default };
exports.default = FlowView;

},{"./FlowView/Details":16,"./FlowView/Messages":18,"./FlowView/Nav":19,"./Prompt":30,"lodash":"lodash","react":"react"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.TimeStamp = TimeStamp;
exports.ConnectionInfo = ConnectionInfo;
exports.CertificateInfo = CertificateInfo;
exports.Timing = Timing;
exports.default = Details;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TimeStamp(_ref) {
    var t = _ref.t;
    var deltaTo = _ref.deltaTo;
    var title = _ref.title;

    return t ? _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement(
            'td',
            null,
            title,
            ':'
        ),
        _react2.default.createElement(
            'td',
            null,
            (0, _utils.formatTimeStamp)(t),
            deltaTo && _react2.default.createElement(
                'span',
                { className: 'text-muted' },
                '(',
                (0, _utils.formatTimeDelta)(1000 * (t - deltaTo)),
                ')'
            )
        )
    ) : _react2.default.createElement('tr', null);
}

function ConnectionInfo(_ref2) {
    var conn = _ref2.conn;

    return _react2.default.createElement(
        'table',
        { className: 'connection-table' },
        _react2.default.createElement(
            'tbody',
            null,
            _react2.default.createElement(
                'tr',
                { key: 'address' },
                _react2.default.createElement(
                    'td',
                    null,
                    'Address:'
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    conn.address.address.join(':')
                )
            ),
            conn.sni && _react2.default.createElement(
                'tr',
                { key: 'sni' },
                _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                        'abbr',
                        { title: 'TLS Server Name Indication' },
                        'TLS SNI:'
                    )
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    conn.sni
                )
            )
        )
    );
}

function CertificateInfo(_ref3) {
    var flow = _ref3.flow;

    // @todo We should fetch human-readable certificate representation from the server
    return _react2.default.createElement(
        'div',
        null,
        flow.client_conn.cert && [_react2.default.createElement(
            'h4',
            { key: 'name' },
            'Client Certificate'
        ), _react2.default.createElement(
            'pre',
            { key: 'value', style: { maxHeight: 100 } },
            flow.client_conn.cert
        )],
        flow.server_conn.cert && [_react2.default.createElement(
            'h4',
            { key: 'name' },
            'Server Certificate'
        ), _react2.default.createElement(
            'pre',
            { key: 'value', style: { maxHeight: 100 } },
            flow.server_conn.cert
        )]
    );
}

function Timing(_ref4) {
    var flow = _ref4.flow;
    var sc = flow.server_conn;
    var cc = flow.client_conn;
    var req = flow.request;
    var res = flow.response;


    var timestamps = [{
        title: "Server conn. initiated",
        t: sc.timestamp_start,
        deltaTo: req.timestamp_start
    }, {
        title: "Server conn. TCP handshake",
        t: sc.timestamp_tcp_setup,
        deltaTo: req.timestamp_start
    }, {
        title: "Server conn. SSL handshake",
        t: sc.timestamp_ssl_setup,
        deltaTo: req.timestamp_start
    }, {
        title: "Client conn. established",
        t: cc.timestamp_start,
        deltaTo: req.timestamp_start
    }, {
        title: "Client conn. SSL handshake",
        t: cc.timestamp_ssl_setup,
        deltaTo: req.timestamp_start
    }, {
        title: "First request byte",
        t: req.timestamp_start
    }, {
        title: "Request complete",
        t: req.timestamp_end,
        deltaTo: req.timestamp_start
    }, res && {
        title: "First response byte",
        t: res.timestamp_start,
        deltaTo: req.timestamp_start
    }, res && {
        title: "Response complete",
        t: res.timestamp_end,
        deltaTo: req.timestamp_start
    }];

    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'h4',
            null,
            'Timing'
        ),
        _react2.default.createElement(
            'table',
            { className: 'timing-table' },
            _react2.default.createElement(
                'tbody',
                null,
                timestamps.filter(function (v) {
                    return v;
                }).sort(function (a, b) {
                    return a.t - b.t;
                }).map(function (item) {
                    return _react2.default.createElement(TimeStamp, _extends({ key: item.title }, item));
                })
            )
        )
    );
}

function Details(_ref5) {
    var flow = _ref5.flow;

    return _react2.default.createElement(
        'section',
        null,
        _react2.default.createElement(
            'h4',
            null,
            'Client Connection'
        ),
        _react2.default.createElement(ConnectionInfo, { conn: flow.client_conn }),
        _react2.default.createElement(
            'h4',
            null,
            'Server Connection'
        ),
        _react2.default.createElement(ConnectionInfo, { conn: flow.server_conn }),
        _react2.default.createElement(CertificateInfo, { flow: flow }),
        _react2.default.createElement(Timing, { flow: flow })
    );
}

},{"../../utils.js":56,"lodash":"lodash","react":"react"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ValueEditor = require('../ValueEditor');

var _ValueEditor2 = _interopRequireDefault(_ValueEditor);

var _utils = require('../../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderEditor = function (_Component) {
    _inherits(HeaderEditor, _Component);

    function HeaderEditor() {
        _classCallCheck(this, HeaderEditor);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(HeaderEditor).apply(this, arguments));
    }

    _createClass(HeaderEditor, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_ValueEditor2.default, _extends({ ref: 'input' }, this.props, { onKeyDown: this.onKeyDown, inline: true }));
        }
    }, {
        key: 'focus',
        value: function focus() {
            _reactDom2.default.findDOMNode(this).focus();
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            switch (e.keyCode) {
                case _utils.Key.BACKSPACE:
                    var s = window.getSelection().getRangeAt(0);
                    if (s.startOffset === 0 && s.endOffset === 0) {
                        this.props.onRemove(e);
                    }
                    break;
                case _utils.Key.TAB:
                    if (!e.shiftKey) {
                        this.props.onTab(e);
                    }
                    break;
            }
        }
    }]);

    return HeaderEditor;
}(_react.Component);

var Headers = function (_Component2) {
    _inherits(Headers, _Component2);

    function Headers() {
        _classCallCheck(this, Headers);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Headers).apply(this, arguments));
    }

    _createClass(Headers, [{
        key: 'onChange',
        value: function onChange(row, col, val) {
            var nextHeaders = _.cloneDeep(this.props.message.headers);

            nextHeaders[row][col] = val;

            if (!nextHeaders[row][0] && !nextHeaders[row][1]) {
                // do not delete last row
                if (nextHeaders.length === 1) {
                    nextHeaders[0][0] = 'Name';
                    nextHeaders[0][1] = 'Value';
                } else {
                    nextHeaders.splice(row, 1);
                    // manually move selection target if this has been the last row.
                    if (row === nextHeaders.length) {
                        this._nextSel = row - 1 + '-value';
                    }
                }
            }

            this.props.onChange(nextHeaders);
        }
    }, {
        key: 'edit',
        value: function edit() {
            this.refs['0-key'].focus();
        }
    }, {
        key: 'onTab',
        value: function onTab(row, col, e) {
            var headers = this.props.message.headers;

            if (row !== headers.length - 1 || col !== 1) {
                return;
            }

            e.preventDefault();

            var nextHeaders = _.cloneDeep(this.props.message.headers);
            nextHeaders.push(['Name', 'Value']);
            this.props.onChange(nextHeaders);
            this._nextSel = row + 1 + '-key';
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this._nextSel && this.refs[this._nextSel]) {
                this.refs[this._nextSel].focus();
                this._nextSel = undefined;
            }
        }
    }, {
        key: 'onRemove',
        value: function onRemove(row, col, e) {
            if (col === 1) {
                e.preventDefault();
                this.refs[row + '-key'].focus();
            } else if (row > 0) {
                e.preventDefault();
                this.refs[row - 1 + '-value'].focus();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var message = this.props.message;


            return _react2.default.createElement(
                'table',
                { className: 'header-table' },
                _react2.default.createElement(
                    'tbody',
                    null,
                    message.headers.map(function (header, i) {
                        return _react2.default.createElement(
                            'tr',
                            { key: i },
                            _react2.default.createElement(
                                'td',
                                { className: 'header-name' },
                                _react2.default.createElement(HeaderEditor, {
                                    ref: i + '-key',
                                    content: header[0],
                                    onDone: function onDone(val) {
                                        return _this3.onChange(i, 0, val);
                                    },
                                    onRemove: function onRemove(event) {
                                        return _this3.onRemove(i, 0, event);
                                    },
                                    onTab: function onTab(event) {
                                        return _this3.onTab(i, 0, event);
                                    }
                                }),
                                ':'
                            ),
                            _react2.default.createElement(
                                'td',
                                { className: 'header-value' },
                                _react2.default.createElement(HeaderEditor, {
                                    ref: i + '-value',
                                    content: header[1],
                                    onDone: function onDone(val) {
                                        return _this3.onChange(i, 1, val);
                                    },
                                    onRemove: function onRemove(event) {
                                        return _this3.onRemove(i, 1, event);
                                    },
                                    onTab: function onTab(event) {
                                        return _this3.onTab(i, 1, event);
                                    }
                                })
                            )
                        );
                    })
                )
            );
        }
    }]);

    return Headers;
}(_react.Component);

Headers.propTypes = {
    onChange: _react.PropTypes.func.isRequired,
    message: _react.PropTypes.object.isRequired
};
exports.default = Headers;

},{"../../utils.js":56,"../ValueEditor":32,"react":"react","react-dom":"react-dom"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Response = exports.Request = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.ErrorView = ErrorView;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../flow/utils.js');

var _utils2 = require('../../utils.js');

var _ContentView = require('../ContentView');

var _ContentView2 = _interopRequireDefault(_ContentView);

var _ValueEditor = require('../ValueEditor');

var _ValueEditor2 = _interopRequireDefault(_ValueEditor);

var _Headers = require('./Headers');

var _Headers2 = _interopRequireDefault(_Headers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RequestLine = function (_Component) {
    _inherits(RequestLine, _Component);

    function RequestLine() {
        _classCallCheck(this, RequestLine);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RequestLine).apply(this, arguments));
    }

    _createClass(RequestLine, [{
        key: 'render',
        value: function render() {
            var _props = this.props;
            var flow = _props.flow;
            var updateFlow = _props.updateFlow;


            return _react2.default.createElement(
                'div',
                { className: 'first-line request-line' },
                _react2.default.createElement(_ValueEditor2.default, {
                    ref: 'method',
                    content: flow.request.method,
                    onDone: function onDone(method) {
                        return updateFlow({ request: { method: method } });
                    },
                    inline: true
                }),
                ' ',
                _react2.default.createElement(_ValueEditor2.default, {
                    ref: 'url',
                    content: _utils.RequestUtils.pretty_url(flow.request),
                    onDone: function onDone(url) {
                        return updateFlow({ request: Object.assign({ path: '' }, (0, _utils.parseUrl)(url)) });
                    },
                    isValid: function isValid(url) {
                        return !!(0, _utils.parseUrl)(url).host;
                    },
                    inline: true
                }),
                ' ',
                _react2.default.createElement(_ValueEditor2.default, {
                    ref: 'httpVersion',
                    content: flow.request.http_version,
                    onDone: function onDone(ver) {
                        return updateFlow({ request: { http_version: (0, _utils.parseHttpVersion)(ver) } });
                    },
                    isValid: _utils.isValidHttpVersion,
                    inline: true
                })
            );
        }
    }]);

    return RequestLine;
}(_react.Component);

var ResponseLine = function (_Component2) {
    _inherits(ResponseLine, _Component2);

    function ResponseLine() {
        _classCallCheck(this, ResponseLine);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ResponseLine).apply(this, arguments));
    }

    _createClass(ResponseLine, [{
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var flow = _props2.flow;
            var updateFlow = _props2.updateFlow;


            return _react2.default.createElement(
                'div',
                { className: 'first-line response-line' },
                _react2.default.createElement(_ValueEditor2.default, {
                    ref: 'httpVersion',
                    content: flow.response.http_version,
                    onDone: function onDone(nextVer) {
                        return updateFlow({ response: { http_version: (0, _utils.parseHttpVersion)(nextVer) } });
                    },
                    isValid: _utils.isValidHttpVersion,
                    inline: true
                }),
                ' ',
                _react2.default.createElement(_ValueEditor2.default, {
                    ref: 'code',
                    content: flow.response.status_code + '',
                    onDone: function onDone(code) {
                        return updateFlow({ response: { code: parseInt(code) } });
                    },
                    isValid: function isValid(code) {
                        return (/^\d+$/.test(code)
                        );
                    },
                    inline: true
                }),
                ' ',
                _react2.default.createElement(_ValueEditor2.default, {
                    ref: 'msg',
                    content: flow.response.reason,
                    onDone: function onDone(msg) {
                        return updateFlow({ response: { msg: msg } });
                    },
                    inline: true
                })
            );
        }
    }]);

    return ResponseLine;
}(_react.Component);

var Request = exports.Request = function (_Component3) {
    _inherits(Request, _Component3);

    function Request() {
        _classCallCheck(this, Request);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Request).apply(this, arguments));
    }

    _createClass(Request, [{
        key: 'render',
        value: function render() {
            var _props3 = this.props;
            var flow = _props3.flow;
            var updateFlow = _props3.updateFlow;


            return _react2.default.createElement(
                'section',
                { className: 'request' },
                _react2.default.createElement(RequestLine, { ref: 'requestLine', flow: flow, updateFlow: updateFlow }),
                _react2.default.createElement(_Headers2.default, {
                    ref: 'headers',
                    message: flow.request,
                    onChange: function onChange(headers) {
                        return updateFlow({ request: { headers: headers } });
                    }
                }),
                _react2.default.createElement('hr', null),
                _react2.default.createElement(_ContentView2.default, { flow: flow, message: flow.request })
            );
        }
    }, {
        key: 'edit',
        value: function edit(k) {
            switch (k) {
                case 'm':
                    this.refs.requestLine.refs.method.focus();
                    break;
                case 'u':
                    this.refs.requestLine.refs.url.focus();
                    break;
                case 'v':
                    this.refs.requestLine.refs.httpVersion.focus();
                    break;
                case 'h':
                    this.refs.headers.edit();
                    break;
                default:
                    throw new Error('Unimplemented: ' + k);
            }
        }
    }]);

    return Request;
}(_react.Component);

var Response = exports.Response = function (_Component4) {
    _inherits(Response, _Component4);

    function Response() {
        _classCallCheck(this, Response);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Response).apply(this, arguments));
    }

    _createClass(Response, [{
        key: 'render',
        value: function render() {
            var _props4 = this.props;
            var flow = _props4.flow;
            var updateFlow = _props4.updateFlow;


            return _react2.default.createElement(
                'section',
                { className: 'response' },
                _react2.default.createElement(ResponseLine, { ref: 'responseLine', flow: flow, updateFlow: updateFlow }),
                _react2.default.createElement(_Headers2.default, {
                    ref: 'headers',
                    message: flow.response,
                    onChange: function onChange(headers) {
                        return updateFlow({ response: { headers: headers } });
                    }
                }),
                _react2.default.createElement('hr', null),
                _react2.default.createElement(_ContentView2.default, { flow: flow, message: flow.response })
            );
        }
    }, {
        key: 'edit',
        value: function edit(k) {
            switch (k) {
                case 'c':
                    this.refs.responseLine.refs.status_code.focus();
                    break;
                case 'm':
                    this.refs.responseLine.refs.msg.focus();
                    break;
                case 'v':
                    this.refs.responseLine.refs.httpVersion.focus();
                    break;
                case 'h':
                    this.refs.headers.edit();
                    break;
                default:
                    throw new Error('\'Unimplemented: ' + k);
            }
        }
    }]);

    return Response;
}(_react.Component);

ErrorView.propTypes = {
    flow: _react.PropTypes.object.isRequired
};

function ErrorView(_ref) {
    var flow = _ref.flow;

    return _react2.default.createElement(
        'section',
        null,
        _react2.default.createElement(
            'div',
            { className: 'alert alert-warning' },
            flow.error.msg,
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'small',
                    null,
                    (0, _utils2.formatTimeStamp)(flow.error.timestamp)
                )
            )
        )
    );
}

},{"../../flow/utils.js":55,"../../utils.js":56,"../ContentView":4,"../ValueEditor":32,"./Headers":17,"lodash":"lodash","react":"react"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Nav;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

NavAction.propTypes = {
    icon: _react.PropTypes.string.isRequired,
    title: _react.PropTypes.string.isRequired,
    onClick: _react.PropTypes.func.isRequired
};

function NavAction(_ref) {
    var icon = _ref.icon;
    var title = _ref.title;
    var _onClick = _ref.onClick;

    return _react2.default.createElement(
        'a',
        { title: title,
            href: '#',
            className: 'nav-action',
            onClick: function onClick(event) {
                event.preventDefault();
                _onClick(event);
            } },
        _react2.default.createElement('i', { className: 'fa fa-fw ' + icon })
    );
}

Nav.propTypes = {
    active: _react.PropTypes.string.isRequired,
    tabs: _react.PropTypes.array.isRequired,
    onSelectTab: _react.PropTypes.func.isRequired
};

function Nav(_ref2) {
    var active = _ref2.active;
    var tabs = _ref2.tabs;
    var onSelectTab = _ref2.onSelectTab;

    return _react2.default.createElement(
        'nav',
        { className: 'nav-tabs nav-tabs-sm' },
        tabs.map(function (tab) {
            return _react2.default.createElement(
                'a',
                { key: tab,
                    href: '#',
                    className: (0, _classnames2.default)({ active: active === tab }),
                    onClick: function onClick(event) {
                        event.preventDefault();
                        onSelectTab(tab);
                    } },
                _.capitalize(tab)
            );
        })
    );
}

},{"classnames":"classnames","react":"react","react-redux":"react-redux"}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _utils = require('../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Footer.propTypes = {
    settings: _react2.default.PropTypes.object.isRequired
};

function Footer(_ref) {
    var settings = _ref.settings;

    return _react2.default.createElement(
        'footer',
        null,
        settings.mode && settings.mode != "regular" && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            settings.mode,
            ' mode'
        ),
        settings.intercept && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'Intercept: ',
            settings.intercept
        ),
        settings.showhost && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'showhost'
        ),
        settings.no_upstream_cert && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'no-upstream-cert'
        ),
        settings.rawtcp && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'raw-tcp'
        ),
        !settings.http2 && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'no-http2'
        ),
        settings.anticache && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'anticache'
        ),
        settings.anticomp && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'anticomp'
        ),
        settings.stickyauth && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'stickyauth: ',
            settings.stickyauth
        ),
        settings.stickycookie && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'stickycookie: ',
            settings.stickycookie
        ),
        settings.stream && _react2.default.createElement(
            'span',
            { className: 'label label-success' },
            'stream: ',
            (0, _utils.formatSize)(settings.stream)
        )
    );
}

exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        settings: state.settings.settings
    };
})(Footer);

},{"../utils.js":56,"react":"react","react-redux":"react-redux"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _MainMenu = require('./Header/MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

var _ViewMenu = require('./Header/ViewMenu');

var _ViewMenu2 = _interopRequireDefault(_ViewMenu);

var _OptionMenu = require('./Header/OptionMenu');

var _OptionMenu2 = _interopRequireDefault(_OptionMenu);

var _FileMenu = require('./Header/FileMenu');

var _FileMenu2 = _interopRequireDefault(_FileMenu);

var _FlowMenu = require('./Header/FlowMenu');

var _FlowMenu2 = _interopRequireDefault(_FlowMenu);

var _ui = require('../ducks/ui.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_Component) {
    _inherits(Header, _Component);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Header).apply(this, arguments));
    }

    _createClass(Header, [{
        key: 'handleClick',
        value: function handleClick(active, e) {
            e.preventDefault();
            this.props.setActiveMenu(active.title);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props;
            var updateLocation = _props.updateLocation;
            var query = _props.query;
            var selectedFlow = _props.selectedFlow;
            var activeMenu = _props.activeMenu;


            var entries = [].concat(_toConsumableArray(Header.entries));
            if (selectedFlow) entries.push(_FlowMenu2.default);

            var Active = _.find(entries, function (e) {
                return e.title == activeMenu;
            });

            return _react2.default.createElement(
                'header',
                null,
                _react2.default.createElement(
                    'nav',
                    { className: 'nav-tabs nav-tabs-lg' },
                    _react2.default.createElement(_FileMenu2.default, null),
                    entries.map(function (Entry) {
                        return _react2.default.createElement(
                            'a',
                            { key: Entry.title,
                                href: '#',
                                className: (0, _classnames2.default)({ active: Entry === Active }),
                                onClick: function onClick(e) {
                                    return _this2.handleClick(Entry, e);
                                } },
                            Entry.title
                        );
                    })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'menu' },
                    _react2.default.createElement(Active, {
                        ref: 'active',
                        updateLocation: updateLocation,
                        query: query
                    })
                )
            );
        }
    }]);

    return Header;
}(_react.Component);

Header.entries = [_MainMenu2.default, _ViewMenu2.default, _OptionMenu2.default];
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        selectedFlow: state.flows.views.main.selected[0],
        activeMenu: state.ui.activeMenu
    };
}, {
    setActiveMenu: _ui.setActiveMenu
}, null, {
    withRef: true
})(Header);

},{"../ducks/ui.js":48,"./Header/FileMenu":22,"./Header/FlowMenu":25,"./Header/MainMenu":26,"./Header/OptionMenu":27,"./Header/ViewMenu":28,"classnames":"classnames","react":"react","react-redux":"react-redux"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _flows = require('../../ducks/flows');

var flowsActions = _interopRequireWildcard(_flows);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileMenu = function (_Component) {
    _inherits(FileMenu, _Component);

    function FileMenu(props, context) {
        _classCallCheck(this, FileMenu);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FileMenu).call(this, props, context));

        _this.state = { show: false };

        _this.close = _this.close.bind(_this);
        _this.onFileClick = _this.onFileClick.bind(_this);
        _this.onNewClick = _this.onNewClick.bind(_this);
        _this.onOpenClick = _this.onOpenClick.bind(_this);
        _this.onOpenFile = _this.onOpenFile.bind(_this);
        _this.onSaveClick = _this.onSaveClick.bind(_this);
        return _this;
    }

    _createClass(FileMenu, [{
        key: 'close',
        value: function close() {
            this.setState({ show: false });
            document.removeEventListener('click', this.close);
        }
    }, {
        key: 'onFileClick',
        value: function onFileClick(e) {
            e.preventDefault();

            if (this.state.show) {
                return;
            }

            document.addEventListener('click', this.close);
            this.setState({ show: true });
        }
    }, {
        key: 'onNewClick',
        value: function onNewClick(e) {
            e.preventDefault();
            if (confirm('Delete all flows?')) {
                this.props.clearFlows();
            }
        }
    }, {
        key: 'onOpenClick',
        value: function onOpenClick(e) {
            e.preventDefault();
            this.fileInput.click();
        }
    }, {
        key: 'onOpenFile',
        value: function onOpenFile(e) {
            e.preventDefault();
            if (e.target.files.length > 0) {
                this.props.loadFlows(e.target.files[0]);
                this.fileInput.value = '';
            }
        }
    }, {
        key: 'onSaveClick',
        value: function onSaveClick(e) {
            e.preventDefault();
            this.props.saveFlows();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)('dropdown pull-left', { open: this.state.show }) },
                _react2.default.createElement(
                    'a',
                    { href: '#', className: 'special', onClick: this.onFileClick },
                    'mitmproxy'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'dropdown-menu', role: 'menu' },
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: '#', onClick: this.onNewClick },
                            _react2.default.createElement('i', { className: 'fa fa-fw fa-file' }),
                            'New'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: '#', onClick: this.onOpenClick },
                            _react2.default.createElement('i', { className: 'fa fa-fw fa-folder-open' }),
                            'Open...'
                        ),
                        _react2.default.createElement('input', {
                            ref: function ref(_ref) {
                                return _this2.fileInput = _ref;
                            },
                            className: 'hidden',
                            type: 'file',
                            onChange: this.onOpenFile
                        })
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: '#', onClick: this.onSaveClick },
                            _react2.default.createElement('i', { className: 'fa fa-fw fa-floppy-o' }),
                            'Save...'
                        )
                    ),
                    _react2.default.createElement('li', { role: 'presentation', className: 'divider' }),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: 'http://mitm.it/', target: '_blank' },
                            _react2.default.createElement('i', { className: 'fa fa-fw fa-external-link' }),
                            'Install Certificates...'
                        )
                    )
                )
            );
        }
    }]);

    return FileMenu;
}(_react.Component);

exports.default = (0, _reactRedux.connect)(null, {
    clearFlows: flowsActions.clear,
    loadFlows: flowsActions.upload,
    saveFlows: flowsActions.download
})(FileMenu);

},{"../../ducks/flows":44,"classnames":"classnames","react":"react","react-redux":"react-redux"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterDocs = function (_Component) {
    _inherits(FilterDocs, _Component);

    // @todo move to redux

    function FilterDocs(props, context) {
        _classCallCheck(this, FilterDocs);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FilterDocs).call(this, props, context));

        _this.state = { doc: FilterDocs.doc };
        return _this;
    }

    _createClass(FilterDocs, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            if (!FilterDocs.xhr) {
                FilterDocs.xhr = (0, _utils.fetchApi)('/filter-help').then(function (response) {
                    return response.json();
                });
                FilterDocs.xhr.catch(function () {
                    FilterDocs.xhr = null;
                });
            }
            if (!this.state.doc) {
                FilterDocs.xhr.then(function (doc) {
                    FilterDocs.doc = doc;
                    _this2.setState({ doc: doc });
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var doc = this.state.doc;

            return !doc ? _react2.default.createElement('i', { className: 'fa fa-spinner fa-spin' }) : _react2.default.createElement(
                'table',
                { className: 'table table-condensed' },
                _react2.default.createElement(
                    'tbody',
                    null,
                    doc.commands.map(function (cmd) {
                        return _react2.default.createElement(
                            'tr',
                            { key: cmd[1] },
                            _react2.default.createElement(
                                'td',
                                null,
                                cmd[0].replace(' ', ' ')
                            ),
                            _react2.default.createElement(
                                'td',
                                null,
                                cmd[1]
                            )
                        );
                    }),
                    _react2.default.createElement(
                        'tr',
                        { key: 'docs-link' },
                        _react2.default.createElement(
                            'td',
                            { colSpan: '2' },
                            _react2.default.createElement(
                                'a',
                                { href: 'http://docs.mitmproxy.org/en/stable/features/filters.html',
                                    target: '_blank' },
                                _react2.default.createElement('i', { className: 'fa fa-external-link' }),
                                '&nbsp mitmproxy docs'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return FilterDocs;
}(_react.Component);

FilterDocs.xhr = null;
FilterDocs.doc = null;
exports.default = FilterDocs;

},{"../../utils":56,"react":"react"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../../utils.js');

var _filt = require('../../filt/filt');

var _filt2 = _interopRequireDefault(_filt);

var _FilterDocs = require('./FilterDocs');

var _FilterDocs2 = _interopRequireDefault(_FilterDocs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterInput = function (_Component) {
    _inherits(FilterInput, _Component);

    function FilterInput(props, context) {
        _classCallCheck(this, FilterInput);

        // Consider both focus and mouseover for showing/hiding the tooltip,
        // because onBlur of the input is triggered before the click on the tooltip
        // finalized, hiding the tooltip just as the user clicks on it.

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FilterInput).call(this, props, context));

        _this.state = { value: _this.props.value, focus: false, mousefocus: false };

        _this.onChange = _this.onChange.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onMouseEnter = _this.onMouseEnter.bind(_this);
        _this.onMouseLeave = _this.onMouseLeave.bind(_this);
        return _this;
    }

    _createClass(FilterInput, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ value: nextProps.value });
        }
    }, {
        key: 'isValid',
        value: function isValid(filt) {
            try {
                var str = filt == null ? this.state.value : filt;
                if (str) {
                    _filt2.default.parse(str);
                }
                return true;
            } catch (e) {
                return false;
            }
        }
    }, {
        key: 'getDesc',
        value: function getDesc() {
            if (!this.state.value) {
                return _react2.default.createElement(_FilterDocs2.default, null);
            }
            try {
                return _filt2.default.parse(this.state.value).desc;
            } catch (e) {
                return '' + e;
            }
        }
    }, {
        key: 'onChange',
        value: function onChange(e) {
            var value = e.target.value;
            this.setState({ value: value });

            // Only propagate valid filters upwards.
            if (this.isValid(value)) {
                this.props.onChange(value);
            }
        }
    }, {
        key: 'onFocus',
        value: function onFocus() {
            this.setState({ focus: true });
        }
    }, {
        key: 'onBlur',
        value: function onBlur() {
            this.setState({ focus: false });
        }
    }, {
        key: 'onMouseEnter',
        value: function onMouseEnter() {
            this.setState({ mousefocus: true });
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave() {
            this.setState({ mousefocus: false });
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            if (e.keyCode === _utils.Key.ESC || e.keyCode === _utils.Key.ENTER) {
                this.blur();
                // If closed using ESC/ENTER, hide the tooltip.
                this.setState({ mousefocus: false });
            }
            e.stopPropagation();
        }
    }, {
        key: 'blur',
        value: function blur() {
            _reactDom2.default.findDOMNode(this.refs.input).blur();
            this.context.returnFocus();
        }
    }, {
        key: 'select',
        value: function select() {
            _reactDom2.default.findDOMNode(this.refs.input).select();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var type = _props.type;
            var color = _props.color;
            var placeholder = _props.placeholder;
            var _state = this.state;
            var value = _state.value;
            var focus = _state.focus;
            var mousefocus = _state.mousefocus;

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)('filter-input input-group', { 'has-error': !this.isValid() }) },
                _react2.default.createElement(
                    'span',
                    { className: 'input-group-addon' },
                    _react2.default.createElement('i', { className: 'fa fa-fw fa-' + type, style: { color: color } })
                ),
                _react2.default.createElement('input', {
                    type: 'text',
                    ref: 'input',
                    placeholder: placeholder,
                    className: 'form-control',
                    value: value,
                    onChange: this.onChange,
                    onFocus: this.onFocus,
                    onBlur: this.onBlur,
                    onKeyDown: this.onKeyDown
                }),
                (focus || mousefocus) && _react2.default.createElement(
                    'div',
                    { className: 'popover bottom',
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave },
                    _react2.default.createElement('div', { className: 'arrow' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'popover-content' },
                        this.getDesc()
                    )
                )
            );
        }
    }]);

    return FilterInput;
}(_react.Component);

FilterInput.contextTypes = {
    returnFocus: _react2.default.PropTypes.func
};
exports.default = FilterInput;

},{"../../filt/filt":54,"../../utils.js":56,"./FilterDocs":23,"classnames":"classnames","react":"react","react-dom":"react-dom"}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _Button = require('../common/Button');

var _Button2 = _interopRequireDefault(_Button);

var _utils = require('../../flow/utils.js');

var _flows = require('../../ducks/flows');

var flowsActions = _interopRequireWildcard(_flows);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

FlowMenu.title = 'Flow';

FlowMenu.propTypes = {
    flow: _react.PropTypes.object.isRequired
};

function FlowMenu(_ref) {
    var flow = _ref.flow;
    var acceptFlow = _ref.acceptFlow;
    var replayFlow = _ref.replayFlow;
    var duplicateFlow = _ref.duplicateFlow;
    var removeFlow = _ref.removeFlow;
    var revertFlow = _ref.revertFlow;


    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            { className: 'menu-row' },
            _react2.default.createElement(_Button2.default, { disabled: !flow.intercepted, title: '[a]ccept intercepted flow', text: 'Accept', icon: 'fa-play', onClick: function onClick() {
                    return acceptFlow(flow);
                } }),
            _react2.default.createElement(_Button2.default, { title: '[r]eplay flow', text: 'Replay', icon: 'fa-repeat', onClick: function onClick() {
                    return replayFlow(flow);
                } }),
            _react2.default.createElement(_Button2.default, { title: '[D]uplicate flow', text: 'Duplicate', icon: 'fa-copy', onClick: function onClick() {
                    return duplicateFlow(flow);
                } }),
            _react2.default.createElement(_Button2.default, { title: '[d]elete flow', text: 'Delete', icon: 'fa-trash', onClick: function onClick() {
                    return removeFlow(flow);
                } }),
            _react2.default.createElement(_Button2.default, { disabled: !flow.modified, title: 'revert changes to flow [V]', text: 'Revert', icon: 'fa-history', onClick: function onClick() {
                    return revertFlow(flow);
                } }),
            _react2.default.createElement(_Button2.default, { title: 'download', text: 'Download', icon: 'fa-download', onClick: function onClick() {
                    return window.location = _utils.MessageUtils.getContentURL(flow, flow.response);
                } })
        ),
        _react2.default.createElement('div', { className: 'clearfix' })
    );
}

exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        flow: state.flows.list.byId[state.flows.views.main.selected[0]]
    };
}, {
    acceptFlow: flowsActions.accept,
    replayFlow: flowsActions.replay,
    duplicateFlow: flowsActions.duplicate,
    removeFlow: flowsActions.remove,
    revertFlow: flowsActions.revert
})(FlowMenu);

},{"../../ducks/flows":44,"../../flow/utils.js":55,"../common/Button":35,"react":"react","react-redux":"react-redux"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _FilterInput = require('./FilterInput');

var _FilterInput2 = _interopRequireDefault(_FilterInput);

var _actions = require('../../actions.js');

var _settings = require('../../ducks/settings');

var _ui = require('../../ducks/ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainMenu = function (_Component) {
    _inherits(MainMenu, _Component);

    function MainMenu(props, context) {
        _classCallCheck(this, MainMenu);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MainMenu).call(this, props, context));

        _this.onSearchChange = _this.onSearchChange.bind(_this);
        _this.onHighlightChange = _this.onHighlightChange.bind(_this);
        return _this;
    }

    _createClass(MainMenu, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.refs[this.props.selectedInput]) {
                this.refs[this.props.selectedInput].select();
            }
            this.props.setSelectedInput(null);
        }
    }, {
        key: 'onSearchChange',
        value: function onSearchChange(val) {
            this.props.updateLocation(undefined, _defineProperty({}, _actions.Query.SEARCH, val));
        }
    }, {
        key: 'onHighlightChange',
        value: function onHighlightChange(val) {
            this.props.updateLocation(undefined, _defineProperty({}, _actions.Query.HIGHLIGHT, val));
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var query = _props.query;
            var settings = _props.settings;
            var updateSettings = _props.updateSettings;


            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'menu-row' },
                    _react2.default.createElement(_FilterInput2.default, {
                        ref: 'search',
                        placeholder: 'Search',
                        type: 'search',
                        color: 'black',
                        value: query[_actions.Query.SEARCH] || '',
                        onChange: this.onSearchChange
                    }),
                    _react2.default.createElement(_FilterInput2.default, {
                        ref: 'highlight',
                        placeholder: 'Highlight',
                        type: 'tag',
                        color: 'hsl(48, 100%, 50%)',
                        value: query[_actions.Query.HIGHLIGHT] || '',
                        onChange: this.onHighlightChange
                    }),
                    _react2.default.createElement(_FilterInput2.default, {
                        ref: 'intercept',
                        placeholder: 'Intercept',
                        type: 'pause',
                        color: 'hsl(208, 56%, 53%)',
                        value: settings.intercept || '',
                        onChange: function onChange(intercept) {
                            return updateSettings({ intercept: intercept });
                        }
                    })
                ),
                _react2.default.createElement('div', { className: 'clearfix' })
            );
        }
    }]);

    return MainMenu;
}(_react.Component);

MainMenu.title = 'Start';
MainMenu.route = 'flows';
MainMenu.propTypes = {
    query: _react.PropTypes.object.isRequired,
    settings: _react.PropTypes.object.isRequired,
    updateLocation: _react.PropTypes.func.isRequired,
    updateSettings: _react.PropTypes.func.isRequired
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        settings: state.settings.settings,
        selectedInput: state.ui.selectedInput
    };
}, {
    updateSettings: _settings.update,
    setSelectedInput: _ui.setSelectedInput
}, null, {
    withRef: true
})(MainMenu);

},{"../../actions.js":2,"../../ducks/settings":47,"../../ducks/ui":48,"./FilterInput":24,"react":"react","react-redux":"react-redux"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ToggleButton = require('../common/ToggleButton');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _ToggleInputButton = require('../common/ToggleInputButton');

var _ToggleInputButton2 = _interopRequireDefault(_ToggleInputButton);

var _settings = require('../../ducks/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

OptionMenu.title = 'Options';

OptionMenu.propTypes = {
    settings: _react.PropTypes.object.isRequired,
    onSettingsChange: _react.PropTypes.func.isRequired
};

function OptionMenu(_ref) {
    var settings = _ref.settings;
    var onSettingsChange = _ref.onSettingsChange;

    // @todo use settings.map
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            { className: 'menu-row' },
            _react2.default.createElement(_ToggleButton2.default, { text: 'showhost',
                checked: settings.showhost,
                onToggle: function onToggle() {
                    return onSettingsChange({ showhost: !settings.showhost });
                }
            }),
            _react2.default.createElement(_ToggleButton2.default, { text: 'no_upstream_cert',
                checked: settings.no_upstream_cert,
                onToggle: function onToggle() {
                    return onSettingsChange({ no_upstream_cert: !settings.no_upstream_cert });
                }
            }),
            _react2.default.createElement(_ToggleButton2.default, { text: 'rawtcp',
                checked: settings.rawtcp,
                onToggle: function onToggle() {
                    return onSettingsChange({ rawtcp: !settings.rawtcp });
                }
            }),
            _react2.default.createElement(_ToggleButton2.default, { text: 'http2',
                checked: settings.http2,
                onToggle: function onToggle() {
                    return onSettingsChange({ http2: !settings.http2 });
                }
            }),
            _react2.default.createElement(_ToggleButton2.default, { text: 'anticache',
                checked: settings.anticache,
                onToggle: function onToggle() {
                    return onSettingsChange({ anticache: !settings.anticache });
                }
            }),
            _react2.default.createElement(_ToggleButton2.default, { text: 'anticomp',
                checked: settings.anticomp,
                onToggle: function onToggle() {
                    return onSettingsChange({ anticomp: !settings.anticomp });
                }
            }),
            _react2.default.createElement(_ToggleInputButton2.default, { name: 'stickyauth', placeholder: 'Sticky auth filter',
                checked: !!settings.stickyauth,
                txt: settings.stickyauth || '',
                onToggleChanged: function onToggleChanged(txt) {
                    return onSettingsChange({ stickyauth: !settings.stickyauth ? txt : null });
                }
            }),
            _react2.default.createElement(_ToggleInputButton2.default, { name: 'stickycookie', placeholder: 'Sticky cookie filter',
                checked: !!settings.stickycookie,
                txt: settings.stickycookie || '',
                onToggleChanged: function onToggleChanged(txt) {
                    return onSettingsChange({ stickycookie: !settings.stickycookie ? txt : null });
                }
            }),
            _react2.default.createElement(_ToggleInputButton2.default, { name: 'stream', placeholder: 'stream...',
                checked: !!settings.stream,
                txt: settings.stream || '',
                inputType: 'number',
                onToggleChanged: function onToggleChanged(txt) {
                    return onSettingsChange({ stream: !settings.stream ? txt : null });
                }
            })
        ),
        _react2.default.createElement('div', { className: 'clearfix' })
    );
}

exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        settings: state.settings.settings
    };
}, {
    onSettingsChange: _settings.update
})(OptionMenu);

},{"../../ducks/settings":47,"../common/ToggleButton":37,"../common/ToggleInputButton":38,"react":"react","react-redux":"react-redux"}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ToggleButton = require('../common/ToggleButton');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _eventLog = require('../../ducks/eventLog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ViewMenu.title = 'View';
ViewMenu.route = 'flows';

ViewMenu.propTypes = {
    eventLogVisible: _react.PropTypes.bool.isRequired,
    toggleEventLog: _react.PropTypes.func.isRequired
};

function ViewMenu(_ref) {
    var eventLogVisible = _ref.eventLogVisible;
    var toggleEventLog = _ref.toggleEventLog;

    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            { className: 'menu-row' },
            _react2.default.createElement(_ToggleButton2.default, { text: 'Show Event Log', checked: eventLogVisible, onToggle: toggleEventLog })
        ),
        _react2.default.createElement('div', { className: 'clearfix' })
    );
}

exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        eventLogVisible: state.eventLog.visible
    };
}, {
    toggleEventLog: _eventLog.toggleVisibility
})(ViewMenu);

},{"../../ducks/eventLog":43,"../common/ToggleButton":37,"react":"react","react-redux":"react-redux"}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('../actions.js');

var _utils = require('../utils.js');

var _Splitter = require('./common/Splitter');

var _Splitter2 = _interopRequireDefault(_Splitter);

var _FlowTable = require('./FlowTable');

var _FlowTable2 = _interopRequireDefault(_FlowTable);

var _FlowView = require('./FlowView');

var _FlowView2 = _interopRequireDefault(_FlowView);

var _flows = require('../ducks/flows');

var flowsActions = _interopRequireWildcard(_flows);

var _main = require('../ducks/views/main');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainView = function (_Component) {
    _inherits(MainView, _Component);

    function MainView() {
        _classCallCheck(this, MainView);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MainView).apply(this, arguments));
    }

    _createClass(MainView, [{
        key: 'componentWillReceiveProps',


        /**
         * @todo move to actions
         * @todo replace with mapStateToProps
         */
        value: function componentWillReceiveProps(nextProps) {
            // Update redux store with route changes
            if (nextProps.routeParams.flowId !== (nextProps.selectedFlow || {}).id) {
                this.props.selectFlow(nextProps.routeParams.flowId);
            }
            if (nextProps.location.query[_actions.Query.SEARCH] !== nextProps.filter) {
                this.props.updateFilter(nextProps.location.query[_actions.Query.SEARCH], false);
            }
            if (nextProps.location.query[_actions.Query.HIGHLIGHT] !== nextProps.highlight) {
                this.props.updateHighlight(nextProps.location.query[_actions.Query.HIGHLIGHT], false);
            }
        }

        /**
         * @todo move to actions
         */

    }, {
        key: 'selectFlow',
        value: function selectFlow(flow) {
            if (flow) {
                this.props.updateLocation('/flows/' + flow.id + '/' + (this.props.routeParams.detailTab || 'request'));
            } else {
                this.props.updateLocation('/flows');
            }
        }

        /**
         * @todo move to actions
         */

    }, {
        key: 'selectFlowRelative',
        value: function selectFlowRelative(shift) {
            var _props = this.props;
            var flows = _props.flows;
            var routeParams = _props.routeParams;
            var selectedFlow = _props.selectedFlow;

            var index = 0;
            if (!routeParams.flowId) {
                if (shift < 0) {
                    index = flows.length - 1;
                }
            } else {
                index = Math.min(Math.max(0, flows.indexOf(selectedFlow) + shift), flows.length - 1);
            }
            this.selectFlow(flows[index]);
        }

        /**
         * @todo move to actions
         */

    }, {
        key: 'onMainKeyDown',
        value: function onMainKeyDown(e) {
            var flow = this.props.selectedFlow;
            if (e.ctrlKey) {
                return;
            }
            switch (e.keyCode) {
                case _utils.Key.K:
                case _utils.Key.UP:
                    this.selectFlowRelative(-1);
                    break;
                case _utils.Key.J:
                case _utils.Key.DOWN:
                    this.selectFlowRelative(+1);
                    break;
                case _utils.Key.SPACE:
                case _utils.Key.PAGE_DOWN:
                    this.selectFlowRelative(+10);
                    break;
                case _utils.Key.PAGE_UP:
                    this.selectFlowRelative(-10);
                    break;
                case _utils.Key.END:
                    this.selectFlowRelative(+1e10);
                    break;
                case _utils.Key.HOME:
                    this.selectFlowRelative(-1e10);
                    break;
                case _utils.Key.ESC:
                    this.selectFlow(null);
                    break;
                case _utils.Key.H:
                case _utils.Key.LEFT:
                    if (this.refs.flowDetails) {
                        this.refs.flowDetails.nextTab(-1);
                    }
                    break;
                case _utils.Key.L:
                case _utils.Key.TAB:
                case _utils.Key.RIGHT:
                    if (this.refs.flowDetails) {
                        this.refs.flowDetails.nextTab(+1);
                    }
                    break;
                case _utils.Key.C:
                    if (e.shiftKey) {
                        this.props.clearFlows();
                    }
                    break;
                case _utils.Key.D:
                    if (flow) {
                        if (e.shiftKey) {
                            this.props.duplicateFlow(flow);
                        } else {
                            this.props.removeFlow(flow);
                        }
                    }
                    break;
                case _utils.Key.A:
                    if (e.shiftKey) {
                        this.props.acceptAllFlows();
                    } else if (flow && flow.intercepted) {
                        this.props.acceptFlow(flow);
                    }
                    break;
                case _utils.Key.R:
                    if (!e.shiftKey && flow) {
                        this.props.replayFlow(flow);
                    }
                    break;
                case _utils.Key.V:
                    if (e.shiftKey && flow && flow.modified) {
                        this.props.revertFlow(flow);
                    }
                    break;
                case _utils.Key.E:
                    if (this.refs.flowDetails) {
                        this.refs.flowDetails.promptEdit();
                    }
                    break;
                case _utils.Key.SHIFT:
                    break;
                default:
                    console.debug('keydown', e.keyCode);
                    return;
            }
            e.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props2 = this.props;
            var flows = _props2.flows;
            var selectedFlow = _props2.selectedFlow;
            var highlight = _props2.highlight;

            return _react2.default.createElement(
                'div',
                { className: 'main-view' },
                _react2.default.createElement(_FlowTable2.default, {
                    ref: 'flowTable',
                    flows: flows,
                    selected: selectedFlow,
                    highlight: highlight,
                    onSelect: function onSelect(flow) {
                        return _this2.selectFlow(flow);
                    }
                }),
                selectedFlow && [_react2.default.createElement(_Splitter2.default, { key: 'splitter' }), _react2.default.createElement(_FlowView2.default, {
                    key: 'flowDetails',
                    ref: 'flowDetails',
                    tab: this.props.routeParams.detailTab,
                    query: this.props.query,
                    updateLocation: this.props.updateLocation,
                    updateFlow: function updateFlow(data) {
                        return _this2.props.updateFlow(selectedFlow, data);
                    },
                    flow: selectedFlow
                })]
            );
        }
    }]);

    return MainView;
}(_react.Component);

MainView.propTypes = {
    highlight: _react.PropTypes.string,
    sort: _react.PropTypes.object
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        flows: state.flows.views.main.view.data,
        filter: state.flows.views.main.filter,
        highlight: state.flows.views.main.highlight,
        selectedFlow: state.flows.list.byId[state.flows.views.main.selected[0]]
    };
}, {
    selectFlow: _main.select,
    updateFilter: _main.updateFilter,
    updateHighlight: _main.updateHighlight,
    updateFlow: flowsActions.update,
    clearFlows: flowsActions.clear,
    duplicateFlow: flowsActions.duplicate,
    removeFlow: flowsActions.remove,
    acceptAllFlows: flowsActions.acceptAll,
    acceptFlow: flowsActions.accept,
    replayFlow: flowsActions.replay,
    revertFlow: flowsActions.revert
}, undefined, { withRef: true })(MainView);

},{"../actions.js":2,"../ducks/flows":44,"../ducks/views/main":52,"../utils.js":56,"./FlowTable":11,"./FlowView":15,"./common/Splitter":36,"react":"react","react-redux":"react-redux"}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Prompt;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Prompt.contextTypes = {
    returnFocus: _react.PropTypes.func
};

Prompt.propTypes = {
    options: _react.PropTypes.array.isRequired,
    done: _react.PropTypes.func.isRequired,
    prompt: _react.PropTypes.string
};

function Prompt(_ref, context) {
    var prompt = _ref.prompt;
    var done = _ref.done;
    var options = _ref.options;

    var opts = [];

    function keyTaken(k) {
        return _lodash2.default.map(opts, 'key').includes(k);
    }

    for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        if (_lodash2.default.isString(opt)) {
            var str = opt;
            while (str.length > 0 && keyTaken(str[0])) {
                str = str.substr(1);
            }
            opt = { text: opt, key: str[0] };
        }
        if (!opt.text || !opt.key || keyTaken(opt.key)) {
            throw 'invalid options';
        }
        opts.push(opt);
    }

    function onKeyDown(event) {
        event.stopPropagation();
        event.preventDefault();
        var key = opts.find(function (opt) {
            return _utils.Key[opt.key.toUpperCase()] === event.keyCode;
        });
        if (!key && event.keyCode !== _utils.Key.ESC && event.keyCode !== _utils.Key.ENTER) {
            return;
        }
        done(key.key || false);
        context.returnFocus();
    }

    return _react2.default.createElement(
        'div',
        { tabIndex: '0', onKeyDown: onKeyDown, className: 'prompt-dialog' },
        _react2.default.createElement(
            'div',
            { className: 'prompt-content' },
            prompt || _react2.default.createElement(
                'strong',
                null,
                'Select: '
            ),
            opts.map(function (opt) {
                var idx = opt.text.indexOf(opt.key);
                function onClick(event) {
                    done(opt.key);
                    event.stopPropagation();
                }
                return _react2.default.createElement(
                    'span',
                    { key: opt.key, className: 'option', onClick: onClick },
                    idx !== -1 ? opt.text.substring(0, idx) : opt.text + '(',
                    _react2.default.createElement(
                        'strong',
                        { className: 'text-primary' },
                        opt.key
                    ),
                    idx !== -1 ? opt.text.substring(idx + 1) : ')'
                );
            })
        )
    );
}

},{"../utils.js":56,"lodash":"lodash","react":"react","react-dom":"react-dom"}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactRedux = require('react-redux');

var _app = require('../ducks/app');

var _ui = require('../ducks/ui');

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _EventLog = require('./EventLog');

var _EventLog2 = _interopRequireDefault(_EventLog);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _utils = require('../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProxyAppMain = function (_Component) {
    _inherits(ProxyAppMain, _Component);

    function ProxyAppMain(props, context) {
        _classCallCheck(this, ProxyAppMain);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ProxyAppMain).call(this, props, context));

        _this.focus = _this.focus.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.updateLocation = _this.updateLocation.bind(_this);
        return _this;
    }

    _createClass(ProxyAppMain, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.appInit();
        }

        /**
         * @todo listen to window's key events
         */

    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.focus();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.appDestruct();
        }

        /**
         * @todo use props
         */

    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return { returnFocus: this.focus };
        }

        /**
         * @todo remove it
         */

    }, {
        key: 'focus',
        value: function focus() {
            document.activeElement.blur();
            window.getSelection().removeAllRanges();
            _reactDom2.default.findDOMNode(this).focus();
        }

        /**
         * @todo move to actions
         * @todo bind on window
         */

    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            switch (e.keyCode) {
                case _utils.Key.I:
                    this.props.setSelectedInput('intercept');
                    break;
                case _utils.Key.L:
                    this.props.setSelectedInput('search');
                    break;
                case _utils.Key.H:
                    this.props.setSelectedInput('highlight');
                    break;
                default:
                    // let main = this.refs.view.refs.wrappedInstance || this.refs.view
                    // if (main.onMainKeyDown) {
                    //     main.onMainKeyDown(e)
                    // }
                    return; // don't prevent default then
            }

            e.preventDefault();
        }

        /**
         * @todo move to actions
         */

    }, {
        key: 'updateLocation',
        value: function updateLocation(pathname, queryUpdate) {
            if (pathname === undefined) {
                pathname = this.props.location.pathname;
            }
            var query = this.props.location.query;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(queryUpdate || {})[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    query[key] = queryUpdate[key] || undefined;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.context.router.replace({ pathname: pathname, query: query });
        }

        /**
         * @todo pass in with props
         */

    }, {
        key: 'getQuery',
        value: function getQuery() {
            // For whatever reason, react-router always returns the same object, which makes comparing
            // the current props with nextProps impossible. As a workaround, we just clone the query object.
            return _lodash2.default.clone(this.props.location.query);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var showEventLog = _props.showEventLog;
            var location = _props.location;
            var children = _props.children;

            var query = this.getQuery();
            return _react2.default.createElement(
                'div',
                { id: 'container', tabIndex: '0', onKeyDown: this.onKeyDown },
                _react2.default.createElement(_Header2.default, { ref: 'header', updateLocation: this.updateLocation, query: query }),
                _react2.default.cloneElement(children, { ref: 'view', location: location, query: query, updateLocation: this.updateLocation }),
                showEventLog && _react2.default.createElement(_EventLog2.default, { key: 'eventlog' }),
                _react2.default.createElement(_Footer2.default, null)
            );
        }
    }]);

    return ProxyAppMain;
}(_react.Component);

ProxyAppMain.childContextTypes = {
    returnFocus: _react.PropTypes.func.isRequired
};
ProxyAppMain.contextTypes = {
    router: _react.PropTypes.object.isRequired
};
exports.default = (0, _reactRedux.connect)(function (state) {
    return {
        showEventLog: state.eventLog.visible,
        settings: state.settings.settings
    };
}, {
    appInit: _app.init,
    appDestruct: _app.destruct,
    setSelectedInput: _ui.setSelectedInput
})(ProxyAppMain);

},{"../ducks/app":42,"../ducks/ui":48,"../utils.js":56,"./EventLog":9,"./Footer":20,"./Header":21,"lodash":"lodash","react":"react","react-dom":"react-dom","react-redux":"react-redux"}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ValidateEditor = require('./ValueEditor/ValidateEditor');

var _ValidateEditor2 = _interopRequireDefault(_ValidateEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValueEditor = function (_Component) {
    _inherits(ValueEditor, _Component);

    function ValueEditor(props) {
        _classCallCheck(this, ValueEditor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValueEditor).call(this, props));

        _this.focus = _this.focus.bind(_this);
        return _this;
    }

    _createClass(ValueEditor, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var tag = this.props.inline ? "span" : 'div';
            return _react2.default.createElement(_ValidateEditor2.default, _extends({}, this.props, {
                onStop: function onStop() {
                    return _this2.context.returnFocus();
                },
                tag: tag
            }));
        }
    }, {
        key: 'focus',
        value: function focus() {
            _reactDom2.default.findDOMNode(this).focus();
        }
    }]);

    return ValueEditor;
}(_react.Component);

ValueEditor.contextTypes = {
    returnFocus: _react.PropTypes.func
};
ValueEditor.propTypes = {
    content: _react.PropTypes.string.isRequired,
    onDone: _react.PropTypes.func.isRequired,
    inline: _react.PropTypes.bool
};
exports.default = ValueEditor;

},{"./ValueEditor/ValidateEditor":34,"react":"react","react-dom":"react-dom"}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = require('../../utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditorBase = function (_Component) {
    _inherits(EditorBase, _Component);

    function EditorBase(props) {
        _classCallCheck(this, EditorBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EditorBase).call(this, props));

        _this.state = { editable: false };

        _this.onPaste = _this.onPaste.bind(_this);
        _this.onMouseDown = _this.onMouseDown.bind(_this);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.stop = _this.stop.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onInput = _this.onInput.bind(_this);
        return _this;
    }

    _createClass(EditorBase, [{
        key: 'stop',
        value: function stop() {
            // a stop would cause a blur as a side-effect.
            // but a blur event must trigger a stop as well.
            // to fix this, make stop = blur and do the actual stop in the onBlur handler.
            _reactDom2.default.findDOMNode(this).blur();
            this.props.onStop();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(this.props.tag, _extends({}, this.props, {
                tabIndex: '0',
                className: 'inline-input ' + this.props.className,
                contentEditable: this.state.editable || undefined,
                onFocus: this.onFocus,
                onMouseDown: this.onMouseDown,
                onClick: this.onClick,
                onBlur: this.onBlur,
                onKeyDown: this.onKeyDown,
                onInput: this.onInput,
                onPaste: this.onPaste,
                dangerouslySetInnerHTML: { __html: this.props.contentToHtml(this.props.content) }
            }));
        }
    }, {
        key: 'onPaste',
        value: function onPaste(e) {
            e.preventDefault();
            var content = e.clipboardData.getData('text/plain');
            document.execCommand('insertHTML', false, content);
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            this._mouseDown = true;
            window.addEventListener('mouseup', this.onMouseUp);
            this.props.onMouseDown(e);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp() {
            if (this._mouseDown) {
                this._mouseDown = false;
                window.removeEventListener('mouseup', this.onMouseUp);
            }
        }
    }, {
        key: 'onClick',
        value: function onClick(e) {
            this.onMouseUp();
            this.onFocus(e);
        }
    }, {
        key: 'onFocus',
        value: function onFocus(e) {
            var _this2 = this;

            if (this._mouseDown || this._ignore_events || this.state.editable) {
                return;
            }

            // contenteditable in FireFox is more or less broken.
            // - we need to blur() and then focus(), otherwise the caret is not shown.
            // - blur() + focus() == we need to save the caret position before
            //   Firefox sometimes just doesn't set a caret position => use caretPositionFromPoint
            var sel = window.getSelection();
            var range = void 0;
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            } else if (document.caretPositionFromPoint && e.clientX && e.clientY) {
                var pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
            } else if (document.caretRangeFromPoint && e.clientX && e.clientY) {
                range = document.caretRangeFromPoint(e.clientX, e.clientY);
            } else {
                range = document.createRange();
                range.selectNodeContents(_reactDom2.default.findDOMNode(this));
            }

            this._ignore_events = true;
            this.setState({ editable: true }, function () {
                var node = _reactDom2.default.findDOMNode(_this2);
                node.blur();
                node.focus();
                _this2._ignore_events = false;
            });
        }
    }, {
        key: 'onBlur',
        value: function onBlur(e) {
            if (this._ignore_events) {
                return;
            }
            window.getSelection().removeAllRanges(); //make sure that selection is cleared on blur
            this.setState({ editable: false });
            this.props.onDone(this.props.nodeToContent(_reactDom2.default.findDOMNode(this)));
            this.props.onBlur(e);
        }
    }, {
        key: 'reset',
        value: function reset() {
            _reactDom2.default.findDOMNode(this).innerHTML = this.props.contentToHtml(this.props.content);
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            e.stopPropagation();
            switch (e.keyCode) {
                case _utils.Key.ESC:
                    e.preventDefault();
                    this.reset();
                    this.stop();
                    break;
                case _utils.Key.ENTER:
                    if (this.props.submitOnEnter && !e.shiftKey) {
                        e.preventDefault();
                        this.stop();
                    }
                    break;
                default:
                    break;
            }
        }
    }, {
        key: 'onInput',
        value: function onInput() {
            this.props.onInput(this.props.nodeToContent(_reactDom2.default.findDOMNode(this)));
        }
    }]);

    return EditorBase;
}(_react.Component);

EditorBase.propTypes = {
    content: _react.PropTypes.string.isRequired,
    onDone: _react.PropTypes.func.isRequired,
    contentToHtml: _react.PropTypes.func,
    nodeToContent: _react.PropTypes.func,
    onStop: _react.PropTypes.func,
    submitOnEnter: _react.PropTypes.bool,
    className: _react.PropTypes.string,
    tag: _react.PropTypes.string
};
EditorBase.defaultProps = {
    contentToHtml: function contentToHtml(content) {
        return _.escape(content);
    },
    nodeToContent: function nodeToContent(node) {
        return node.textContent;
    },
    submitOnEnter: true,
    className: '',
    tag: 'div',
    onStop: _.noop,
    onMouseDown: _.noop,
    onBlur: _.noop,
    onInput: _.noop
};
exports.default = EditorBase;

},{"../../utils.js":56,"react":"react","react-dom":"react-dom"}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _EditorBase = require('./EditorBase');

var _EditorBase2 = _interopRequireDefault(_EditorBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidateEditor = function (_Component) {
    _inherits(ValidateEditor, _Component);

    function ValidateEditor(props) {
        _classCallCheck(this, ValidateEditor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValidateEditor).call(this, props));

        _this.state = { currentContent: props.content };
        _this.onInput = _this.onInput.bind(_this);
        _this.onDone = _this.onDone.bind(_this);
        return _this;
    }

    _createClass(ValidateEditor, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ currentContent: nextProps.content });
        }
    }, {
        key: 'onInput',
        value: function onInput(currentContent) {
            this.setState({ currentContent: currentContent });
            this.props.onInput && this.props.onInput(currentContent);
        }
    }, {
        key: 'onDone',
        value: function onDone(content) {
            if (this.props.isValid && !this.props.isValid(content)) {
                this.refs.editor.reset();
                content = this.props.content;
            }
            this.props.onDone(content);
        }
    }, {
        key: 'render',
        value: function render() {
            var className = this.props.className || '';
            if (this.props.isValid) {
                if (this.props.isValid(this.state.currentContent)) {
                    className += ' has-success';
                } else {
                    className += ' has-warning';
                }
            }
            return _react2.default.createElement(_EditorBase2.default, _extends({}, this.props, {
                ref: 'editor',
                className: className,
                onDone: this.onDone,
                onInput: this.onInput
            }));
        }
    }]);

    return ValidateEditor;
}(_react.Component);

ValidateEditor.propTypes = {
    content: _react.PropTypes.string.isRequired,
    onDone: _react.PropTypes.func.isRequired,
    onInput: _react.PropTypes.func,
    isValid: _react.PropTypes.func,
    className: _react.PropTypes.string
};
exports.default = ValidateEditor;

},{"./EditorBase":33,"react":"react","react-dom":"react-dom"}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Button;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Button.propTypes = {
    onClick: _react.PropTypes.func.isRequired,
    text: _react.PropTypes.string.isRequired
};

function Button(_ref) {
    var onClick = _ref.onClick;
    var text = _ref.text;
    var icon = _ref.icon;
    var disabled = _ref.disabled;

    return _react2.default.createElement(
        "div",
        { className: "btn btn-default",
            onClick: onClick,
            disabled: disabled },
        _react2.default.createElement("i", { className: "fa fa-fw " + icon }),
        " ",
        text
    );
}

},{"react":"react"}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Splitter = function (_Component) {
    _inherits(Splitter, _Component);

    function Splitter(props, context) {
        _classCallCheck(this, Splitter);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Splitter).call(this, props, context));

        _this.state = { applied: false, startX: false, startY: false };

        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        return _this;
    }

    _createClass(Splitter, [{
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            this.setState({ startX: e.pageX, startY: e.pageY });

            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
            // Occasionally, only a dragEnd event is triggered, but no mouseUp.
            window.addEventListener('dragend', this.onDragEnd);
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd() {
            _reactDom2.default.findDOMNode(this).style.transform = '';

            window.removeEventListener('dragend', this.onDragEnd);
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousemove', this.onMouseMove);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp(e) {
            this.onDragEnd();

            var node = _reactDom2.default.findDOMNode(this);
            var prev = node.previousElementSibling;

            var flexBasis = prev.offsetHeight + e.pageY - this.state.startY;

            if (this.props.axis === 'x') {
                flexBasis = prev.offsetWidth + e.pageX - this.state.startX;
            }

            prev.style.flex = '0 0 ' + Math.max(0, flexBasis) + 'px';
            node.nextElementSibling.style.flex = '1 1 auto';

            this.setState({ applied: true });
            this.onResize();
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e) {
            var dX = 0;
            var dY = 0;
            if (this.props.axis === 'x') {
                dX = e.pageX - this.state.startX;
            } else {
                dY = e.pageY - this.state.startY;
            }
            _reactDom2.default.findDOMNode(this).style.transform = 'translate(' + dX + 'px, ' + dY + 'px)';
        }
    }, {
        key: 'onResize',
        value: function onResize() {
            // Trigger a global resize event. This notifies components that employ virtual scrolling
            // that their viewport may have changed.
            window.setTimeout(function () {
                return window.dispatchEvent(new CustomEvent('resize'));
            }, 1);
        }
    }, {
        key: 'reset',
        value: function reset(willUnmount) {
            if (!this.state.applied) {
                return;
            }

            var node = _reactDom2.default.findDOMNode(this);

            node.previousElementSibling.style.flex = '';
            node.nextElementSibling.style.flex = '';

            if (!willUnmount) {
                this.setState({ applied: false });
            }
            this.onResize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.reset(true);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)('splitter', this.props.axis === 'x' ? 'splitter-x' : 'splitter-y') },
                _react2.default.createElement('div', { onMouseDown: this.onMouseDown, draggable: 'true' })
            );
        }
    }]);

    return Splitter;
}(_react.Component);

Splitter.defaultProps = { axis: 'x' };
exports.default = Splitter;

},{"classnames":"classnames","react":"react","react-dom":"react-dom"}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ToggleButton;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ToggleButton.propTypes = {
    checked: _react.PropTypes.bool.isRequired,
    onToggle: _react.PropTypes.func.isRequired,
    text: _react.PropTypes.string.isRequired
};

function ToggleButton(_ref) {
    var checked = _ref.checked;
    var onToggle = _ref.onToggle;
    var text = _ref.text;

    return _react2.default.createElement(
        "div",
        { className: "btn btn-toggle " + (checked ? "btn-primary" : "btn-default"), onClick: onToggle },
        _react2.default.createElement("i", { className: "fa fa-fw " + (checked ? "fa-check-square-o" : "fa-square-o") }),
        " ",
        text
    );
}

},{"react":"react"}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToggleInputButton = function (_Component) {
    _inherits(ToggleInputButton, _Component);

    function ToggleInputButton(props) {
        _classCallCheck(this, ToggleInputButton);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ToggleInputButton).call(this, props));

        _this.state = { txt: props.txt };
        return _this;
    }

    _createClass(ToggleInputButton, [{
        key: 'onChange',
        value: function onChange(e) {
            this.setState({ txt: e.target.value });
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            e.stopPropagation();
            if (e.keyCode === _utils.Key.ENTER) {
                this.props.onToggleChanged(this.state.txt);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'input-group toggle-input-btn' },
                _react2.default.createElement(
                    'span',
                    { className: 'input-group-btn',
                        onClick: function onClick() {
                            return _this2.props.onToggleChanged(_this2.state.txt);
                        } },
                    _react2.default.createElement(
                        'div',
                        { className: (0, _classnames2.default)('btn', this.props.checked ? 'btn-primary' : 'btn-default') },
                        _react2.default.createElement('span', { className: (0, _classnames2.default)('fa', this.props.checked ? 'fa-check-square-o' : 'fa-square-o') }),
                        ' ',
                        this.props.name
                    )
                ),
                _react2.default.createElement('input', {
                    className: 'form-control',
                    placeholder: this.props.placeholder,
                    disabled: this.props.checked,
                    value: this.state.txt,
                    type: this.props.inputType,
                    onChange: function onChange(e) {
                        return _this2.onChange(e);
                    },
                    onKeyDown: function onKeyDown(e) {
                        return _this2.onKeyDown(e);
                    }
                })
            );
        }
    }]);

    return ToggleInputButton;
}(_react.Component);

ToggleInputButton.propTypes = {
    name: _react.PropTypes.string.isRequired,
    txt: _react.PropTypes.string.isRequired,
    onToggleChanged: _react.PropTypes.func.isRequired
};
exports.default = ToggleInputButton;

},{"../../utils":56,"classnames":"classnames","react":"react"}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var symShouldStick = Symbol("shouldStick");
var isAtBottom = function isAtBottom(v) {
    return v.scrollTop + v.clientHeight === v.scrollHeight;
};

exports.default = function (Component) {
    var _class, _temp;

    return Object.assign((_temp = _class = function (_Component) {
        _inherits(AutoScrollWrapper, _Component);

        function AutoScrollWrapper() {
            _classCallCheck(this, AutoScrollWrapper);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(AutoScrollWrapper).apply(this, arguments));
        }

        _createClass(AutoScrollWrapper, [{
            key: "componentWillUpdate",
            value: function componentWillUpdate() {
                var viewport = _reactDom2.default.findDOMNode(this);
                this[symShouldStick] = viewport.scrollTop && isAtBottom(viewport);
                _get(Object.getPrototypeOf(AutoScrollWrapper.prototype), "componentWillUpdate", this) && _get(Object.getPrototypeOf(AutoScrollWrapper.prototype), "componentWillUpdate", this).call(this);
            }
        }, {
            key: "componentDidUpdate",
            value: function componentDidUpdate() {
                var viewport = _reactDom2.default.findDOMNode(this);
                if (this[symShouldStick] && !isAtBottom(viewport)) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
                _get(Object.getPrototypeOf(AutoScrollWrapper.prototype), "componentDidUpdate", this) && _get(Object.getPrototypeOf(AutoScrollWrapper.prototype), "componentDidUpdate", this).call(this);
            }
        }]);

        return AutoScrollWrapper;
    }(Component), _class.displayName = Component.name, _temp), Component);
};

},{"react":"react","react-dom":"react-dom"}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.calcVScroll = calcVScroll;
/**
 * Calculate virtual scroll stuffs
 *
 * @param {?Object} opts Options for calculation
 *
 * @returns {Object} result
 *
 * __opts__ should have following properties:
 * - {number}         itemCount
 * - {number}         rowHeight
 * - {number}         viewportTop
 * - {number}         viewportHeight
 * - {Array<?number>} [itemHeights]
 *
 * __result__ have following properties:
 * - {number} start
 * - {number} end
 * - {number} paddingTop
 * - {number} paddingBottom
 */
function calcVScroll(opts) {
    if (!opts) {
        return { start: 0, end: 0, paddingTop: 0, paddingBottom: 0 };
    }

    var itemCount = opts.itemCount;
    var rowHeight = opts.rowHeight;
    var viewportTop = opts.viewportTop;
    var viewportHeight = opts.viewportHeight;
    var itemHeights = opts.itemHeights;

    var viewportBottom = viewportTop + viewportHeight;

    var start = 0;
    var end = 0;

    var paddingTop = 0;
    var paddingBottom = 0;

    if (itemHeights) {

        for (var i = 0, pos = 0; i < itemCount; i++) {
            var height = itemHeights[i] || rowHeight;

            if (pos <= viewportTop && i % 2 === 0) {
                paddingTop = pos;
                start = i;
            }

            if (pos <= viewportBottom) {
                end = i + 1;
            } else {
                paddingBottom += height;
            }

            pos += height;
        }
    } else {

        // Make sure that we start at an even row so that CSS `:nth-child(even)` is preserved
        start = Math.max(0, Math.floor(viewportTop / rowHeight) - 1) & ~1;
        end = Math.min(itemCount, start + Math.ceil(viewportHeight / rowHeight) + 2);

        // When a large trunk of elements is removed from the button, start may be far off the viewport.
        // To make this issue less severe, limit the top placeholder to the total number of rows.
        paddingTop = Math.min(start, itemCount) * rowHeight;
        paddingBottom = Math.max(0, itemCount - end) * rowHeight;
    }

    return { start: start, end: end, paddingTop: paddingTop, paddingBottom: paddingBottom };
}

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppDispatcher = undefined;

var _flux = require("flux");

var _flux2 = _interopRequireDefault(_flux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PayloadSources = {
    VIEW: "view",
    SERVER: "server"
};

var AppDispatcher = exports.AppDispatcher = new _flux2.default.Dispatcher();
AppDispatcher.dispatchViewAction = function (action) {
    action.source = PayloadSources.VIEW;
    this.dispatch(action);
};
AppDispatcher.dispatchServerAction = function (action) {
    action.source = PayloadSources.SERVER;
    this.dispatch(action);
};

},{"flux":"flux"}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.INIT = undefined;
exports.reduce = reduce;
exports.init = init;
exports.destruct = destruct;

var _websocket = require('./websocket');

var INIT = exports.INIT = 'APP_INIT';

var defaultState = {};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        default:
            return state;
    }
}

function init() {
    return function (dispatch) {
        dispatch((0, _websocket.connect)());
        dispatch({ type: INIT });
    };
}

function destruct() {
    return function (dispatch) {
        dispatch((0, _websocket.disconnect)());
        dispatch({ type: DESTRUCT });
    };
}

},{"./websocket":53}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FETCH_ERROR = exports.UNKNOWN_CMD = exports.TOGGLE_FILTER = exports.TOGGLE_VISIBILITY = exports.RECEIVE = exports.ADD = exports.DATA_URL = exports.MSG_TYPE = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.toggleFilter = toggleFilter;
exports.toggleVisibility = toggleVisibility;
exports.add = add;
exports.handleWsMsg = handleWsMsg;
exports.fetchData = fetchData;
exports.receiveData = receiveData;

var _list = require('./utils/list');

var listActions = _interopRequireWildcard(_list);

var _view = require('./utils/view');

var viewActions = _interopRequireWildcard(_view);

var _websocket = require('./websocket');

var websocketActions = _interopRequireWildcard(_websocket);

var _msgQueue = require('./msgQueue');

var msgQueueActions = _interopRequireWildcard(_msgQueue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MSG_TYPE = exports.MSG_TYPE = 'UPDATE_EVENTLOG';
var DATA_URL = exports.DATA_URL = '/events';

var ADD = exports.ADD = 'EVENTLOG_ADD';
var RECEIVE = exports.RECEIVE = 'EVENTLOG_RECEIVE';
var TOGGLE_VISIBILITY = exports.TOGGLE_VISIBILITY = 'EVENTLOG_TOGGLE_VISIBILITY';
var TOGGLE_FILTER = exports.TOGGLE_FILTER = 'EVENTLOG_TOGGLE_FILTER';
var UNKNOWN_CMD = exports.UNKNOWN_CMD = 'EVENTLOG_UNKNOWN_CMD';
var FETCH_ERROR = exports.FETCH_ERROR = 'EVENTLOG_FETCH_ERROR';

var defaultState = {
    logId: 0,
    visible: false,
    filters: { debug: false, info: true, web: true },
    list: (0, listActions.default)(undefined, {}),
    view: (0, viewActions.default)(undefined, {})
};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    var _ret = function () {
        switch (action.type) {

            case TOGGLE_VISIBILITY:
                return {
                    v: _extends({}, state, {
                        visible: !state.visible
                    })
                };

            case TOGGLE_FILTER:
                var filters = _extends({}, state.filters, _defineProperty({}, action.filter, !state.filters[action.filter]));
                return {
                    v: _extends({}, state, {
                        filters: filters,
                        view: (0, viewActions.default)(state.view, viewActions.updateFilter(state.list, function (log) {
                            return filters[log.level];
                        }))
                    })
                };

            case ADD:
                var item = {
                    id: state.logId,
                    message: action.message,
                    level: action.level
                };
                return {
                    v: _extends({}, state, {
                        logId: state.logId + 1,
                        list: (0, listActions.default)(state.list, listActions.add(item)),
                        view: (0, viewActions.default)(state.view, viewActions.add(item, function (log) {
                            return state.filters[log.level];
                        }))
                    })
                };

            case RECEIVE:
                return {
                    v: _extends({}, state, {
                        list: (0, listActions.default)(state.list, listActions.receive(action.list)),
                        view: (0, viewActions.default)(state.view, viewActions.receive(list, function (log) {
                            return state.filters[log.level];
                        }))
                    })
                };

            default:
                return {
                    v: state
                };
        }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
}

/**
 * @public
 */
function toggleFilter(filter) {
    return { type: TOGGLE_FILTER, filter: filter };
}

/**
 * @public
 *
 * @todo move to ui?
 */
function toggleVisibility() {
    return { type: TOGGLE_VISIBILITY };
}

/**
 * @public
 */
function add(message) {
    var level = arguments.length <= 1 || arguments[1] === undefined ? 'web' : arguments[1];

    return { type: ADD, message: message, level: level };
}

/**
 * This action creater takes all WebSocket events
 *
 * @public websocket
 */
function handleWsMsg(msg) {
    switch (msg.cmd) {

        case websocketActions.CMD_ADD:
            return add(msg.data.message, msg.data.level);

        case websocketActions.CMD_RESET:
            return fetchData();

        default:
            return { type: UNKNOWN_CMD, msg: msg };
    }
}

/**
 * @public websocket
 */
function fetchData() {
    return msgQueueActions.fetchData(MSG_TYPE);
}

/**
 * @public msgQueue
 */
function receiveData(list) {
    return { type: RECEIVE, list: list };
}

},{"./msgQueue":46,"./utils/list":49,"./utils/view":50,"./websocket":53}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FETCH_ERROR = exports.UNKNOWN_CMD = exports.REQUEST_ACTION = exports.RECEIVE = exports.REMOVE = exports.UPDATE = exports.ADD = exports.DATA_URL = exports.MSG_TYPE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.accept = accept;
exports.acceptAll = acceptAll;
exports.remove = remove;
exports.duplicate = duplicate;
exports.replay = replay;
exports.revert = revert;
exports.update = update;
exports.clear = clear;
exports.download = download;
exports.upload = upload;
exports.handleWsMsg = handleWsMsg;
exports.fetchData = fetchData;
exports.receiveData = receiveData;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.removeItem = removeItem;

var _utils = require('../utils');

var _list = require('./utils/list');

var listActions = _interopRequireWildcard(_list);

var _views = require('./views');

var viewsActions = _interopRequireWildcard(_views);

var _msgQueue = require('./msgQueue');

var msgQueueActions = _interopRequireWildcard(_msgQueue);

var _websocket = require('./websocket');

var websocketActions = _interopRequireWildcard(_websocket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var MSG_TYPE = exports.MSG_TYPE = 'UPDATE_FLOWS';
var DATA_URL = exports.DATA_URL = '/flows';

var ADD = exports.ADD = 'FLOWS_ADD';
var UPDATE = exports.UPDATE = 'FLOWS_UPDATE';
var REMOVE = exports.REMOVE = 'FLOWS_REMOVE';
var RECEIVE = exports.RECEIVE = 'FLOWS_RECEIVE';
var REQUEST_ACTION = exports.REQUEST_ACTION = 'FLOWS_REQUEST_ACTION';
var UNKNOWN_CMD = exports.UNKNOWN_CMD = 'FLOWS_UNKNOWN_CMD';
var FETCH_ERROR = exports.FETCH_ERROR = 'FLOWS_FETCH_ERROR';

var defaultState = {
    list: undefined,
    views: undefined
};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case ADD:
            return _extends({}, state, {
                list: (0, listActions.default)(state.list, listActions.add(action.item)),
                views: (0, viewsActions.default)(state.views, viewsActions.add(action.item))
            });

        case UPDATE:
            return _extends({}, state, {
                list: (0, listActions.default)(state.list, listActions.update(action.id, action.item)),
                views: (0, viewsActions.default)(state.views, viewsActions.update(action.id, action.item))
            });

        case REMOVE:
            return _extends({}, state, {
                list: (0, listActions.default)(state.list, listActions.remove(action.id)),
                views: (0, viewsActions.default)(state.views, viewsActions.remove(action.id))
            });

        case RECEIVE:
            var list = (0, listActions.default)(state.list, listActions.receive(action.list));
            return _extends({}, state, {
                list: list,
                views: (0, viewsActions.default)(state.views, viewsActions.receive(list))
            });

        default:
            return _extends({}, state, {
                list: (0, listActions.default)(state.list, action),
                views: (0, viewsActions.default)(state.views, action)
            });
    }
}

/**
 * @public
 */
function accept(flow) {
    (0, _utils.fetchApi)('/flows/' + flow.id + '/accept', { method: 'POST' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function acceptAll() {
    (0, _utils.fetchApi)('/flows/accept', { method: 'POST' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function remove(flow) {
    (0, _utils.fetchApi)('/flows/' + flow.id, { method: 'DELETE' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function duplicate(flow) {
    (0, _utils.fetchApi)('/flows/' + flow.id + '/duplicate', { method: 'POST' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function replay(flow) {
    (0, _utils.fetchApi)('/flows/' + flow.id + '/replay', { method: 'POST' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function revert(flow) {
    (0, _utils.fetchApi)('/flows/' + flow.id + '/revert', { method: 'POST' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function update(flow, data) {
    _utils.fetchApi.put('/flows/' + flow.id, data);
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function clear() {
    (0, _utils.fetchApi)('/clear', { method: 'POST' });
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function download() {
    window.location = '/flows/dump';
    return { type: REQUEST_ACTION };
}

/**
 * @public
 */
function upload(file) {
    var body = new FormData();
    body.append('file', file);
    (0, _utils.fetchApi)('/flows/dump', { method: 'post', body: body });
    return { type: REQUEST_ACTION };
}

/**
 * This action creater takes all WebSocket events
 *
 * @public websocket
 */
function handleWsMsg(msg) {
    switch (msg.cmd) {

        case websocketActions.CMD_ADD:
            return addItem(msg.data);

        case websocketActions.CMD_UPDATE:
            return updateItem(msg.data.id, msg.data);

        case websocketActions.CMD_REMOVE:
            return removeItem(msg.data.id);

        case websocketActions.CMD_RESET:
            return fetchData();

        default:
            return { type: UNKNOWN_CMD, msg: msg };
    }
}

/**
 * @public websocket
 */
function fetchData() {
    return msgQueueActions.fetchData(MSG_TYPE);
}

/**
 * @public msgQueue
 */
function receiveData(list) {
    return { type: RECEIVE, list: list };
}

/**
 * @private
 */
function addItem(item) {
    return { type: ADD, item: item };
}

/**
 * @private
 */
function updateItem(id, item) {
    return { type: UPDATE, id: id, item: item };
}

/**
 * @private
 */
function removeItem(id) {
    return { type: REMOVE, id: id };
}

},{"../utils":56,"./msgQueue":46,"./utils/list":49,"./views":51,"./websocket":53}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _eventLog = require('./eventLog');

var _eventLog2 = _interopRequireDefault(_eventLog);

var _websocket = require('./websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _flows = require('./flows');

var _flows2 = _interopRequireDefault(_flows);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _msgQueue = require('./msgQueue');

var _msgQueue2 = _interopRequireDefault(_msgQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
    eventLog: _eventLog2.default,
    websocket: _websocket2.default,
    flows: _flows2.default,
    settings: _settings2.default,
    ui: _ui2.default,
    msgQueue: _msgQueue2.default
});

},{"./eventLog":43,"./flows":44,"./msgQueue":46,"./settings":47,"./ui":48,"./websocket":53,"redux":"redux"}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FETCH_ERROR = exports.CLEAR = exports.ENQUEUE = exports.INIT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _handlers;

exports.default = reduce;
exports.handleWsMsg = handleWsMsg;
exports.fetchData = fetchData;
exports.receive = receive;
exports.init = init;
exports.clear = clear;
exports.fetchError = fetchError;

var _utils = require('../utils');

var _websocket = require('./websocket');

var websocketActions = _interopRequireWildcard(_websocket);

var _eventLog = require('./eventLog');

var eventLogActions = _interopRequireWildcard(_eventLog);

var _flows = require('./flows');

var flowsActions = _interopRequireWildcard(_flows);

var _settings = require('./settings');

var settingsActions = _interopRequireWildcard(_settings);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INIT = exports.INIT = 'MSG_QUEUE_INIT';
var ENQUEUE = exports.ENQUEUE = 'MSG_QUEUE_ENQUEUE';
var CLEAR = exports.CLEAR = 'MSG_QUEUE_CLEAR';
var FETCH_ERROR = exports.FETCH_ERROR = 'MSG_QUEUE_FETCH_ERROR';

var handlers = (_handlers = {}, _defineProperty(_handlers, eventLogActions.MSG_TYPE, eventLogActions), _defineProperty(_handlers, flowsActions.MSG_TYPE, flowsActions), _defineProperty(_handlers, settingsActions.MSG_TYPE, settingsActions), _handlers);

var defaultState = {};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case INIT:
            return _extends({}, state, _defineProperty({}, action.queue, []));

        case ENQUEUE:
            return _extends({}, state, _defineProperty({}, action.queue, [].concat(_toConsumableArray(state[action.queue]), [action.msg])));

        case CLEAR:
            return _extends({}, state, _defineProperty({}, action.queue, null));

        default:
            return state;
    }
}

/**
 * @public websocket
 */
function handleWsMsg(msg) {
    return function (dispatch, getState) {
        var handler = handlers[msg.type];
        if (msg.cmd === websocketActions.CMD_RESET) {
            return dispatch(fetchData(handler.MSG_TYPE));
        }
        if (getState().msgQueue[handler.MSG_TYPE]) {
            return dispatch({ type: ENQUEUE, queue: handler.MSG_TYPE, msg: msg });
        }
        return dispatch(handler.handleWsMsg(msg));
    };
}

/**
 * @public
 */
function fetchData(type) {
    return function (dispatch) {
        var handler = handlers[type];

        dispatch(init(handler.MSG_TYPE));

        (0, _utils.fetchApi)(handler.DATA_URL).then(function (res) {
            return res.json();
        }).then(function (json) {
            return dispatch(receive(type, json));
        }).catch(function (error) {
            return dispatch(fetchError(type, error));
        });
    };
}

/**
 * @private
 */
function receive(type, res) {
    return function (dispatch, getState) {
        var handler = handlers[type];
        var queue = getState().msgQueue[handler.MSG_TYPE] || [];

        dispatch(clear(handler.MSG_TYPE));
        dispatch(handler.receiveData(res.data));
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var msg = _step.value;

                dispatch(handler.handleWsMsg(msg));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };
}

/**
 * @private
 */
function init(queue) {
    return { type: INIT, queue: queue };
}

/**
 * @private
 */
function clear(queue) {
    return { type: CLEAR, queue: queue };
}

/**
 * @private
 */
function fetchError(type, error) {
    var _ref;

    return _ref = { type: FETCH_ERROR }, _defineProperty(_ref, 'type', type), _defineProperty(_ref, 'error', error), _ref;
}

},{"../utils":56,"./eventLog":43,"./flows":44,"./settings":47,"./websocket":53}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UNKNOWN_CMD = exports.REQUEST_UPDATE = exports.UPDATE = exports.RECEIVE = exports.DATA_URL = exports.MSG_TYPE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;
exports.handleWsMsg = handleWsMsg;
exports.update = update;
exports.fetchData = fetchData;
exports.receiveData = receiveData;
exports.updateSettings = updateSettings;

var _utils = require('../utils');

var _websocket = require('./websocket');

var websocketActions = _interopRequireWildcard(_websocket);

var _msgQueue = require('./msgQueue');

var msgQueueActions = _interopRequireWildcard(_msgQueue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var MSG_TYPE = exports.MSG_TYPE = 'UPDATE_SETTINGS';
var DATA_URL = exports.DATA_URL = '/settings';

var RECEIVE = exports.RECEIVE = 'RECEIVE';
var UPDATE = exports.UPDATE = 'UPDATE';
var REQUEST_UPDATE = exports.REQUEST_UPDATE = 'REQUEST_UPDATE';
var UNKNOWN_CMD = exports.UNKNOWN_CMD = 'SETTINGS_UNKNOWN_CMD';

var defaultState = {
    settings: {}
};

function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case RECEIVE:
            return _extends({}, state, {
                settings: action.settings
            });

        case UPDATE:
            return _extends({}, state, {
                settings: _extends({}, state.settings, action.settings)
            });

        default:
            return state;
    }
}

/**
 * @public msgQueue
 */
function handleWsMsg(msg) {
    switch (msg.cmd) {

        case websocketActions.CMD_UPDATE:
            return updateSettings(msg.data);

        default:
            console.error('unknown settings update', msg);
            return { type: UNKNOWN_CMD, msg: msg };
    }
}

/**
 * @public
 */
function update(settings) {
    _utils.fetchApi.put('/settings', settings);
    return { type: REQUEST_UPDATE };
}

/**
 * @public websocket
 */
function fetchData() {
    return msgQueueActions.fetchData(MSG_TYPE);
}

/**
 * @public msgQueue
 */
function receiveData(settings) {
    return { type: RECEIVE, settings: settings };
}

/**
 * @private
 */
function updateSettings(settings) {
    return { type: UPDATE, settings: settings };
}

},{"../utils":56,"./msgQueue":46,"./websocket":53}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SET_SELECTED_INPUT = exports.SET_ACTIVE_MENU = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.setActiveMenu = setActiveMenu;
exports.setSelectedInput = setSelectedInput;

var _main = require('./views/main');

var SET_ACTIVE_MENU = exports.SET_ACTIVE_MENU = 'SET_ACTIVE_MENU';
var SET_SELECTED_INPUT = exports.SET_SELECTED_INPUT = 'SET_SELECTED_INPUT';

var defaultState = {
    activeMenu: 'Start',
    selectedInput: null
};
function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case SET_ACTIVE_MENU:
            return _extends({}, state, {
                activeMenu: action.activeMenu
            });

        case _main.SELECT:
            var isNewSelect = action.flowId && !action.currentSelection;
            var isDeselect = !action.flowId && action.currentSelection;
            if (isNewSelect) {
                return _extends({}, state, {
                    activeMenu: "Flow"
                });
            }
            if (isDeselect && state.activeMenu === "Flow") {
                return _extends({}, state, {
                    activeMenu: "Start"
                });
            }
            return state;

        case SET_SELECTED_INPUT:
            return _extends({}, state, {
                activeMenu: 'Start',
                selectedInput: action.input
            });

        default:
            return state;
    }
}

function setActiveMenu(activeMenu) {
    return {
        type: SET_ACTIVE_MENU,
        activeMenu: activeMenu
    };
}

function setSelectedInput(input) {
    return {
        type: SET_SELECTED_INPUT,
        input: input
    };
}

},{"./views/main":52}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RECEIVE = exports.REMOVE = exports.UPDATE = exports.ADD = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.add = add;
exports.update = update;
exports.remove = remove;
exports.receive = receive;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ADD = exports.ADD = 'LIST_ADD';
var UPDATE = exports.UPDATE = 'LIST_UPDATE';
var REMOVE = exports.REMOVE = 'LIST_REMOVE';
var RECEIVE = exports.RECEIVE = 'LIST_RECEIVE';

var defaultState = {
    data: [],
    byId: {},
    indexOf: {}
};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case ADD:
            return _extends({}, state, {
                data: [].concat(_toConsumableArray(state.data), [action.item]),
                byId: _extends({}, state.byId, _defineProperty({}, action.item.id, action.item)),
                indexOf: _extends({}, state.indexOf, _defineProperty({}, action.item.id, state.data.length))
            });

        case UPDATE:
            {
                var index = state.indexOf[action.id];

                if (index == null) {
                    return state;
                }

                var data = [].concat(_toConsumableArray(state.data));

                data[index] = action.item;

                return _extends({}, state, {
                    data: data,
                    byId: _extends({}, state.byId, _defineProperty({}, action.id, action.item))
                });
            }

        case REMOVE:
            {
                var _index = state.indexOf[action.id];

                if (_index == null) {
                    return state;
                }

                var _data = [].concat(_toConsumableArray(state.data));
                var indexOf = _extends({}, state.indexOf, _defineProperty({}, action.id, null));

                _data.splice(_index, 1);
                for (var i = _data.length - 1; i >= _index; i--) {
                    indexOf[_data[i].id] = i;
                }

                return _extends({}, state, {
                    data: _data,
                    indexOf: indexOf,
                    byId: _extends({}, state.byId, _defineProperty({}, action.id, null))
                });
            }

        case RECEIVE:
            return _extends({}, state, {
                data: action.list,
                byId: _lodash2.default.fromPairs(action.list.map(function (item) {
                    return [item.id, item];
                })),
                indexOf: _lodash2.default.fromPairs(action.list.map(function (item, index) {
                    return [item.id, index];
                }))
            });

        default:
            return state;
    }
}

/**
 * @public
 */
function add(item) {
    return { type: ADD, item: item };
}

/**
 * @public
 */
function update(id, item) {
    return { type: UPDATE, id: id, item: item };
}

/**
 * @public
 */
function remove(id) {
    return { type: REMOVE, id: id };
}

/**
 * @public
 */
function receive(list) {
    return { type: RECEIVE, list: list };
}

},{"lodash":"lodash"}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RECEIVE = exports.REMOVE = exports.UPDATE = exports.ADD = exports.UPDATE_SORT = exports.UPDATE_FILTER = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.updateFilter = updateFilter;
exports.updateSort = updateSort;
exports.add = add;
exports.update = update;
exports.remove = remove;
exports.receive = receive;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var UPDATE_FILTER = exports.UPDATE_FILTER = 'VIEW_UPDATE_FILTER';
var UPDATE_SORT = exports.UPDATE_SORT = 'VIEW_UPDATE_SORT';
var ADD = exports.ADD = 'VIEW_ADD';
var UPDATE = exports.UPDATE = 'VIEW_UPDATE';
var REMOVE = exports.REMOVE = 'VIEW_REMOVE';
var RECEIVE = exports.RECEIVE = 'VIEW_RECEIVE';

var defaultState = {
    data: [],
    indexOf: {}
};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case UPDATE_FILTER:
            {
                var data = action.list.data.filter(action.filter).sort(action.sort);
                return _extends({}, state, {
                    data: data,
                    indexOf: _lodash2.default.fromPairs(data.map(function (item, index) {
                        return [item.id, index];
                    }))
                });
            }

        case UPDATE_SORT:
            {
                var _data = [].concat(_toConsumableArray(state.data)).sort(action.sort);
                return _extends({}, state, {
                    data: _data,
                    indexOf: _lodash2.default.fromPairs(_data.map(function (item, index) {
                        return [item.id, index];
                    }))
                });
            }

        case ADD:
            if (state.indexOf[action.item.id] != null || !action.filter(action.item)) {
                return state;
            }
            return _extends({}, state, sortedInsert(state, action.item, action.sort));

        case REMOVE:
            if (state.indexOf[action.id] == null) {
                return state;
            }
            return _extends({}, state, sortedRemove(state, action.id));

        case UPDATE:
            {
                if (state.indexOf[action.id] == null) {
                    return;
                }
                var nextState = _extends({}, state, sortedRemove(state, action.id));
                if (!action.filter(action.item)) {
                    return nextState;
                }
                return _extends({}, nextState, sortedInsert(nextState, action.item, action.sort));
            }

        case RECEIVE:
            {
                var _data2 = action.list.data.filter(action.filter).sort(action.sort);
                return _extends({}, state, {
                    data: _data2,
                    indexOf: _lodash2.default.fromPairs(_data2.map(function (item, index) {
                        return [item.id, index];
                    }))
                });
            }

        default:
            return state;
    }
}

function updateFilter(list) {
    var filter = arguments.length <= 1 || arguments[1] === undefined ? defaultFilter : arguments[1];
    var sort = arguments.length <= 2 || arguments[2] === undefined ? defaultSort : arguments[2];

    return { type: UPDATE_FILTER, list: list, filter: filter, sort: sort };
}

function updateSort() {
    var sort = arguments.length <= 0 || arguments[0] === undefined ? defaultSort : arguments[0];

    return { type: UPDATE_SORT, sort: sort };
}

function add(item) {
    var filter = arguments.length <= 1 || arguments[1] === undefined ? defaultFilter : arguments[1];
    var sort = arguments.length <= 2 || arguments[2] === undefined ? defaultSort : arguments[2];

    return { type: ADD, item: item, filter: filter, sort: sort };
}

function update(id, item) {
    var filter = arguments.length <= 2 || arguments[2] === undefined ? defaultFilter : arguments[2];
    var sort = arguments.length <= 3 || arguments[3] === undefined ? defaultSort : arguments[3];

    return { type: UPDATE, id: id, item: item, filter: filter, sort: sort };
}

function remove(id) {
    return { type: REMOVE, id: id };
}

function receive(list) {
    var filter = arguments.length <= 1 || arguments[1] === undefined ? defaultFilter : arguments[1];
    var sort = arguments.length <= 2 || arguments[2] === undefined ? defaultSort : arguments[2];

    return { type: RECEIVE, list: list, filter: filter, sort: sort };
}

function sortedInsert(state, item, sort) {
    var index = sortedIndex(state.data, item, sort);
    var data = [].concat(_toConsumableArray(state.data));
    var indexOf = _extends({}, state.indexOf);

    data.splice(index, 0, item);
    for (var i = data.length - 1; i >= index; i--) {
        indexOf[data[i].id] = i;
    }

    return { data: data, indexOf: indexOf };
}

function sortedRemove(state, id) {
    var index = state.indexOf[id];
    var data = [].concat(_toConsumableArray(state.data));
    var indexOf = _extends({}, state.indexOf, _defineProperty({}, id, null));

    data.splice(index, 1);
    for (var i = data.length - 1; i >= index; i--) {
        indexOf[data[i].id] = i;
    }

    return { data: data, indexOf: indexOf };
}

function sortedIndex(list, item, sort) {
    var low = 0;
    var high = list.length;

    while (low < high) {
        var middle = low + high >>> 1;
        if (sort(item, list[middle]) >= 0) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }

    return low;
}

function defaultFilter() {
    return true;
}

function defaultSort(a, b) {
    return 0;
}

},{"lodash":"lodash"}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RECEIVE = exports.REMOVE = exports.UPDATE = exports.ADD = undefined;
exports.add = add;
exports.update = update;
exports.remove = remove;
exports.receive = receive;

var _redux = require('redux');

var _view = require('./utils/view');

var viewActions = _interopRequireWildcard(_view);

var _main = require('./views/main.js');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ADD = exports.ADD = 'FLOW_VIEWS_ADD';
var UPDATE = exports.UPDATE = 'FLOW_VIEWS_UPDATE';
var REMOVE = exports.REMOVE = 'FLOW_VIEWS_REMOVE';
var RECEIVE = exports.RECEIVE = 'FLOW_VIEWS_RECEIVE';

exports.default = (0, _redux.combineReducers)({
    main: _main2.default
});

/**
 * @public
 */

function add(item) {
    return { type: ADD, item: item };
}

/**
 * @public
 */
function update(id, item) {
    return { type: UPDATE, id: id, item: item };
}

/**
 * @public
 */
function remove(id) {
    return { type: REMOVE, id: id };
}

/**
 * @public
 */
function receive(list) {
    return { type: RECEIVE, list: list };
}

},{"./utils/view":50,"./views/main.js":52,"redux":"redux"}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SELECT = exports.UPDATE_HIGHLIGHT = exports.UPDATE_SORT = exports.UPDATE_FILTER = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.updateFilter = updateFilter;
exports.updateHighlight = updateHighlight;
exports.updateSort = updateSort;
exports.select = select;

var _filt = require('../../filt/filt');

var _filt2 = _interopRequireDefault(_filt);

var _utils = require('../../flow/utils');

var _view = require('../utils/view');

var viewActions = _interopRequireWildcard(_view);

var _views = require('../views');

var viewsActions = _interopRequireWildcard(_views);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UPDATE_FILTER = exports.UPDATE_FILTER = 'FLOW_VIEWS_MAIN_UPDATE_FILTER';
var UPDATE_SORT = exports.UPDATE_SORT = 'FLOW_VIEWS_MAIN_UPDATE_SORT';
var UPDATE_HIGHLIGHT = exports.UPDATE_HIGHLIGHT = 'FLOW_VIEWS_MAIN_UPDATE_HIGHLIGHT';
var SELECT = exports.SELECT = 'FLOW_VIEWS_MAIN_SELECT';

var sortKeyFuns = {

    TLSColumn: function TLSColumn(flow) {
        return flow.request.scheme;
    },

    PathColumn: function PathColumn(flow) {
        return _utils.RequestUtils.pretty_url(flow.request);
    },

    MethodColumn: function MethodColumn(flow) {
        return flow.request.method;
    },

    StatusColumn: function StatusColumn(flow) {
        return flow.response && flow.response.status_code;
    },

    TimeColumn: function TimeColumn(flow) {
        return flow.response && flow.response.timestamp_end - flow.request.timestamp_start;
    },

    SizeColumn: function SizeColumn(flow) {
        var total = flow.request.contentLength;
        if (flow.response) {
            total += flow.response.contentLength || 0;
        }
        return total;
    }
};

var defaultState = {
    highlight: null,
    selected: [],
    filter: null,
    sort: { column: null, desc: false },
    view: undefined
};

function reduce() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case UPDATE_HIGHLIGHT:
            return _extends({}, state, {
                highlight: action.highlight
            });

        case SELECT:
            return _extends({}, state, {
                selected: [action.id]
            });

        case UPDATE_FILTER:
            return _extends({}, state, {
                filter: action.filter,
                view: (0, viewActions.default)(state.view, viewActions.updateFilter(action.list, makeFilter(action.filter), makeSort(state.sort)))
            });

        case UPDATE_SORT:
            var sort = { column: action.column, desc: action.desc };
            return _extends({}, state, {
                sort: sort,
                view: (0, viewActions.default)(state.view, viewActions.updateSort(makeSort(sort)))
            });

        case viewsActions.ADD:
            return _extends({}, state, {
                view: (0, viewActions.default)(state.view, viewActions.add(action.item, makeFilter(state.filter), makeSort(state.sort)))
            });

        case viewsActions.UPDATE:
            return _extends({}, state, {
                view: (0, viewActions.default)(state.view, viewActions.update(action.id, action.item, makeFilter(state.filter), makeSort(state.sort)))
            });

        case viewsActions.REMOVE:
            return _extends({}, state, {
                view: (0, viewActions.default)(state.view, viewActions.remove(action.id))
            });

        case viewsActions.RECEIVE:
            return _extends({}, state, {
                view: (0, viewActions.default)(state.view, viewActions.receive(action.list, makeFilter(state.filter), makeSort(state.sort)))
            });

        default:
            return _extends({}, state, {
                view: (0, viewActions.default)(state.view, action)
            });
    }
}

/**
 * @public
 */
function updateFilter(filter) {
    return function (dispatch, getState) {
        dispatch({ type: UPDATE_FILTER, filter: filter, list: getState().flows.list });
    };
}

/**
 * @public
 */
function updateHighlight(highlight) {
    return { type: UPDATE_HIGHLIGHT, highlight: highlight };
}

/**
 * @public
 */
function updateSort(column, desc) {
    return { type: UPDATE_SORT, column: column, desc: desc };
}

/**
 * @public
 */
function select(id) {
    return function (dispatch, getState) {
        dispatch({ type: SELECT, currentSelection: getState().flows.views.main.selected[0], id: id });
    };
}

/**
 * @private
 */
function makeFilter(filter) {
    if (!filter) {
        return;
    }
    return _filt2.default.parse(filter);
}

/**
 * @private
 */
function makeSort(_ref) {
    var column = _ref.column;
    var desc = _ref.desc;

    var sortKeyFun = sortKeyFuns[column];
    if (!sortKeyFun) {
        return;
    }
    return function (a, b) {
        var ka = sortKeyFun(a);
        var kb = sortKeyFun(b);
        if (ka > kb) {
            return desc ? -1 : 1;
        }
        if (ka < kb) {
            return desc ? 1 : -1;
        }
        return 0;
    };
}

},{"../../filt/filt":54,"../../flow/utils":55,"../utils/view":50,"../views":51}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MESSAGE = exports.ERROR = exports.DISCONNECTED = exports.DISCONNECT = exports.CONNECTED = exports.CONNECT = exports.SYM_SOCKET = exports.CMD_RESET = exports.CMD_REMOVE = exports.CMD_UPDATE = exports.CMD_ADD = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reduce;
exports.connect = connect;
exports.disconnect = disconnect;
exports.onConnect = onConnect;
exports.onMessage = onMessage;
exports.onDisconnect = onDisconnect;
exports.onError = onError;

var _actions = require('../actions.js');

var _dispatcher = require('../dispatcher.js');

var _msgQueue = require('./msgQueue');

var msgQueueActions = _interopRequireWildcard(_msgQueue);

var _eventLog = require('./eventLog');

var eventLogActions = _interopRequireWildcard(_eventLog);

var _flows = require('./flows');

var flowsActions = _interopRequireWildcard(_flows);

var _settings = require('./settings');

var settingsActions = _interopRequireWildcard(_settings);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CMD_ADD = exports.CMD_ADD = 'add';
var CMD_UPDATE = exports.CMD_UPDATE = 'update';
var CMD_REMOVE = exports.CMD_REMOVE = 'remove';
var CMD_RESET = exports.CMD_RESET = 'reset';

var SYM_SOCKET = exports.SYM_SOCKET = Symbol('WEBSOCKET_SYM_SOCKET');

var CONNECT = exports.CONNECT = 'WEBSOCKET_CONNECT';
var CONNECTED = exports.CONNECTED = 'WEBSOCKET_CONNECTED';
var DISCONNECT = exports.DISCONNECT = 'WEBSOCKET_DISCONNECT';
var DISCONNECTED = exports.DISCONNECTED = 'WEBSOCKET_DISCONNECTED';
var ERROR = exports.ERROR = 'WEBSOCKET_ERROR';
var MESSAGE = exports.MESSAGE = 'WEBSOCKET_MESSAGE';

/* we may want to have an error message attribute here at some point */
var defaultState = { connected: false, socket: null };

function reduce() {
    var _extends3;

    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];

    switch (action.type) {

        case CONNECT:
            return _extends({}, state, _defineProperty({}, SYM_SOCKET, action.socket));

        case CONNECTED:
            return _extends({}, state, { connected: true });

        case DISCONNECT:
            return _extends({}, state, { connected: false });

        case DISCONNECTED:
            return _extends({}, state, (_extends3 = {}, _defineProperty(_extends3, SYM_SOCKET, null), _defineProperty(_extends3, 'connected', false), _extends3));

        default:
            return state;
    }
}

function connect() {
    return function (dispatch) {
        var socket = new WebSocket(location.origin.replace('http', 'ws') + '/updates');

        socket.addEventListener('open', function () {
            return dispatch(onConnect());
        });
        socket.addEventListener('close', function () {
            return dispatch(onDisconnect());
        });
        socket.addEventListener('message', function (msg) {
            return dispatch(onMessage(JSON.parse(msg.data)));
        });
        socket.addEventListener('error', function (error) {
            return dispatch(onError(error));
        });

        dispatch({ type: CONNECT, socket: socket });
    };
}

function disconnect() {
    return function (dispatch, getState) {
        getState().settings[SYM_SOCKET].close();
        dispatch({ type: DISCONNECT });
    };
}

function onConnect() {
    // workaround to make sure that our state is already available.
    return function (dispatch) {
        dispatch({ type: CONNECTED });
        dispatch(settingsActions.fetchData());
        dispatch(flowsActions.fetchData());
        dispatch(eventLogActions.fetchData());
    };
}

function onMessage(msg) {
    return msgQueueActions.handleWsMsg(msg);
}

function onDisconnect() {
    return function (dispatch) {
        dispatch(eventLogActions.add('WebSocket connection closed.'));
        dispatch({ type: DISCONNECTED });
    };
}

function onError(error) {
    // @todo let event log subscribe WebSocketActions.ERROR
    return function (dispatch) {
        dispatch(eventLogActions.add('WebSocket connection error.'));
        dispatch({ type: ERROR, error: error });
    };
}

},{"../actions.js":2,"../dispatcher.js":41,"./eventLog":43,"./flows":44,"./msgQueue":46,"./settings":47}],54:[function(require,module,exports){
"use strict";

module.exports = function () {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser = this,
        peg$FAILED = {},
        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction = peg$parsestart,
        peg$c0 = { type: "other", description: "filter expression" },
        peg$c1 = function peg$c1(orExpr) {
      return orExpr;
    },
        peg$c2 = { type: "other", description: "whitespace" },
        peg$c3 = /^[ \t\n\r]/,
        peg$c4 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c5 = { type: "other", description: "control character" },
        peg$c6 = /^[|&!()~"]/,
        peg$c7 = { type: "class", value: "[|&!()~\"]", description: "[|&!()~\"]" },
        peg$c8 = { type: "other", description: "optional whitespace" },
        peg$c9 = "|",
        peg$c10 = { type: "literal", value: "|", description: "\"|\"" },
        peg$c11 = function peg$c11(first, second) {
      return or(first, second);
    },
        peg$c12 = "&",
        peg$c13 = { type: "literal", value: "&", description: "\"&\"" },
        peg$c14 = function peg$c14(first, second) {
      return and(first, second);
    },
        peg$c15 = "!",
        peg$c16 = { type: "literal", value: "!", description: "\"!\"" },
        peg$c17 = function peg$c17(expr) {
      return not(expr);
    },
        peg$c18 = "(",
        peg$c19 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c20 = ")",
        peg$c21 = { type: "literal", value: ")", description: "\")\"" },
        peg$c22 = function peg$c22(expr) {
      return binding(expr);
    },
        peg$c23 = "~a",
        peg$c24 = { type: "literal", value: "~a", description: "\"~a\"" },
        peg$c25 = function peg$c25() {
      return assetFilter;
    },
        peg$c26 = "~e",
        peg$c27 = { type: "literal", value: "~e", description: "\"~e\"" },
        peg$c28 = function peg$c28() {
      return errorFilter;
    },
        peg$c29 = "~q",
        peg$c30 = { type: "literal", value: "~q", description: "\"~q\"" },
        peg$c31 = function peg$c31() {
      return noResponseFilter;
    },
        peg$c32 = "~s",
        peg$c33 = { type: "literal", value: "~s", description: "\"~s\"" },
        peg$c34 = function peg$c34() {
      return responseFilter;
    },
        peg$c35 = "true",
        peg$c36 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c37 = function peg$c37() {
      return trueFilter;
    },
        peg$c38 = "false",
        peg$c39 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c40 = function peg$c40() {
      return falseFilter;
    },
        peg$c41 = "~c",
        peg$c42 = { type: "literal", value: "~c", description: "\"~c\"" },
        peg$c43 = function peg$c43(s) {
      return responseCode(s);
    },
        peg$c44 = "~d",
        peg$c45 = { type: "literal", value: "~d", description: "\"~d\"" },
        peg$c46 = function peg$c46(s) {
      return domain(s);
    },
        peg$c47 = "~h",
        peg$c48 = { type: "literal", value: "~h", description: "\"~h\"" },
        peg$c49 = function peg$c49(s) {
      return header(s);
    },
        peg$c50 = "~hq",
        peg$c51 = { type: "literal", value: "~hq", description: "\"~hq\"" },
        peg$c52 = function peg$c52(s) {
      return requestHeader(s);
    },
        peg$c53 = "~hs",
        peg$c54 = { type: "literal", value: "~hs", description: "\"~hs\"" },
        peg$c55 = function peg$c55(s) {
      return responseHeader(s);
    },
        peg$c56 = "~m",
        peg$c57 = { type: "literal", value: "~m", description: "\"~m\"" },
        peg$c58 = function peg$c58(s) {
      return method(s);
    },
        peg$c59 = "~t",
        peg$c60 = { type: "literal", value: "~t", description: "\"~t\"" },
        peg$c61 = function peg$c61(s) {
      return contentType(s);
    },
        peg$c62 = "~tq",
        peg$c63 = { type: "literal", value: "~tq", description: "\"~tq\"" },
        peg$c64 = function peg$c64(s) {
      return requestContentType(s);
    },
        peg$c65 = "~ts",
        peg$c66 = { type: "literal", value: "~ts", description: "\"~ts\"" },
        peg$c67 = function peg$c67(s) {
      return responseContentType(s);
    },
        peg$c68 = "~u",
        peg$c69 = { type: "literal", value: "~u", description: "\"~u\"" },
        peg$c70 = function peg$c70(s) {
      return url(s);
    },
        peg$c71 = { type: "other", description: "integer" },
        peg$c72 = /^['"]/,
        peg$c73 = { type: "class", value: "['\"]", description: "['\"]" },
        peg$c74 = /^[0-9]/,
        peg$c75 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c76 = function peg$c76(digits) {
      return parseInt(digits.join(""), 10);
    },
        peg$c77 = { type: "other", description: "string" },
        peg$c78 = "\"",
        peg$c79 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c80 = function peg$c80(chars) {
      return chars.join("");
    },
        peg$c81 = "'",
        peg$c82 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c83 = /^["\\]/,
        peg$c84 = { type: "class", value: "[\"\\\\]", description: "[\"\\\\]" },
        peg$c85 = { type: "any", description: "any character" },
        peg$c86 = function peg$c86(char) {
      return char;
    },
        peg$c87 = "\\",
        peg$c88 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c89 = /^['\\]/,
        peg$c90 = { type: "class", value: "['\\\\]", description: "['\\\\]" },
        peg$c91 = /^['"\\]/,
        peg$c92 = { type: "class", value: "['\"\\\\]", description: "['\"\\\\]" },
        peg$c93 = "n",
        peg$c94 = { type: "literal", value: "n", description: "\"n\"" },
        peg$c95 = function peg$c95() {
      return "\n";
    },
        peg$c96 = "r",
        peg$c97 = { type: "literal", value: "r", description: "\"r\"" },
        peg$c98 = function peg$c98() {
      return "\r";
    },
        peg$c99 = "t",
        peg$c100 = { type: "literal", value: "t", description: "\"t\"" },
        peg$c101 = function peg$c101() {
      return "\t";
    },
        peg$currPos = 0,
        peg$savedPos = 0,
        peg$posDetailsCache = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos = 0,
        peg$maxFailExpected = [],
        peg$silentFails = 0,
        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(null, [{ type: "other", description: description }], input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
    }

    function error(message) {
      throw peg$buildException(message, null, input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p,
          ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line: details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) {
              details.line++;
            }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) {
        return;
      }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function (a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
          }

          return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
            return '\\x0' + hex(ch);
          }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
            return '\\x' + hex(ch);
          }).replace(/[\u0100-\u0FFF]/g, function (ch) {
            return "\\u0" + hex(ch);
          }).replace(/[\u1000-\uFFFF]/g, function (ch) {
            return "\\u" + hex(ch);
          });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc,
            foundDesc,
            i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location);
    }

    function peg$parsestart() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseOrExpr();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c1(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c0);
        }
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c3.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c4);
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c2);
        }
      }

      return s0;
    }

    function peg$parsecc() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c6.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c7);
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c5);
        }
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      s1 = peg$parsews();
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsews();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c8);
        }
      }

      return s0;
    }

    function peg$parseOrExpr() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseAndExpr();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 124) {
            s3 = peg$c9;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c10);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseOrExpr();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c11(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseAndExpr();
      }

      return s0;
    }

    function peg$parseAndExpr() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseNotExpr();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 38) {
            s3 = peg$c12;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c13);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseAndExpr();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c14(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNotExpr();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsews();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseAndExpr();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c14(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseNotExpr();
        }
      }

      return s0;
    }

    function peg$parseNotExpr() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 33) {
        s1 = peg$c15;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c16);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseNotExpr();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c17(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseBindingExpr();
      }

      return s0;
    }

    function peg$parseBindingExpr() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c18;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c19);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseOrExpr();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c20;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c21);
                }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c22(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseExpr();
      }

      return s0;
    }

    function peg$parseExpr() {
      var s0;

      s0 = peg$parseNullaryExpr();
      if (s0 === peg$FAILED) {
        s0 = peg$parseUnaryExpr();
      }

      return s0;
    }

    function peg$parseNullaryExpr() {
      var s0, s1;

      s0 = peg$parseBooleanLiteral();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c23) {
          s1 = peg$c23;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c24);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c25();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c26) {
            s1 = peg$c26;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c27);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c28();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c29) {
              s1 = peg$c29;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c30);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c31();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c32) {
                s1 = peg$c32;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c33);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c34();
              }
              s0 = s1;
            }
          }
        }
      }

      return s0;
    }

    function peg$parseBooleanLiteral() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c35) {
        s1 = peg$c35;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c36);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c37();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c38) {
          s1 = peg$c38;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c39);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c40();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseUnaryExpr() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c41) {
        s1 = peg$c41;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c42);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsews();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIntegerLiteral();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c43(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c44) {
          s1 = peg$c44;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsews();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseStringLiteral();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c46(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c47) {
            s1 = peg$c47;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c48);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsews();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsews();
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseStringLiteral();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c49(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c50) {
              s1 = peg$c50;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c51);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsews();
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parsews();
                }
              } else {
                s2 = peg$FAILED;
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parseStringLiteral();
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c52(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 3) === peg$c53) {
                s1 = peg$c53;
                peg$currPos += 3;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c54);
                }
              }
              if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsews();
                if (s3 !== peg$FAILED) {
                  while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parsews();
                  }
                } else {
                  s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                  s3 = peg$parseStringLiteral();
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c55(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c56) {
                  s1 = peg$c56;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c57);
                  }
                }
                if (s1 !== peg$FAILED) {
                  s2 = [];
                  s3 = peg$parsews();
                  if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                      s2.push(s3);
                      s3 = peg$parsews();
                    }
                  } else {
                    s2 = peg$FAILED;
                  }
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parseStringLiteral();
                    if (s3 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c58(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c59) {
                    s1 = peg$c59;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c60);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parsews();
                    if (s3 !== peg$FAILED) {
                      while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parsews();
                      }
                    } else {
                      s2 = peg$FAILED;
                    }
                    if (s2 !== peg$FAILED) {
                      s3 = peg$parseStringLiteral();
                      if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c61(s3);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 3) === peg$c62) {
                      s1 = peg$c62;
                      peg$currPos += 3;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c63);
                      }
                    }
                    if (s1 !== peg$FAILED) {
                      s2 = [];
                      s3 = peg$parsews();
                      if (s3 !== peg$FAILED) {
                        while (s3 !== peg$FAILED) {
                          s2.push(s3);
                          s3 = peg$parsews();
                        }
                      } else {
                        s2 = peg$FAILED;
                      }
                      if (s2 !== peg$FAILED) {
                        s3 = peg$parseStringLiteral();
                        if (s3 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c64(s3);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.substr(peg$currPos, 3) === peg$c65) {
                        s1 = peg$c65;
                        peg$currPos += 3;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c66);
                        }
                      }
                      if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$parsews();
                        if (s3 !== peg$FAILED) {
                          while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$parsews();
                          }
                        } else {
                          s2 = peg$FAILED;
                        }
                        if (s2 !== peg$FAILED) {
                          s3 = peg$parseStringLiteral();
                          if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c67(s3);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c68) {
                          s1 = peg$c68;
                          peg$currPos += 2;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c69);
                          }
                        }
                        if (s1 !== peg$FAILED) {
                          s2 = [];
                          s3 = peg$parsews();
                          if (s3 !== peg$FAILED) {
                            while (s3 !== peg$FAILED) {
                              s2.push(s3);
                              s3 = peg$parsews();
                            }
                          } else {
                            s2 = peg$FAILED;
                          }
                          if (s2 !== peg$FAILED) {
                            s3 = peg$parseStringLiteral();
                            if (s3 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c70(s3);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          s1 = peg$parseStringLiteral();
                          if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c70(s1);
                          }
                          s0 = s1;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseIntegerLiteral() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (peg$c72.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c73);
        }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c74.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c75);
          }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c74.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c75);
              }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          if (peg$c72.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c73);
            }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c76(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c71);
        }
      }

      return s0;
    }

    function peg$parseStringLiteral() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c78;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c79);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseDoubleStringChar();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseDoubleStringChar();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c78;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c79);
            }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c80(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c81;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c82);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseSingleStringChar();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseSingleStringChar();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c81;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c82);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c80(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          s2 = peg$parsecc();
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseUnquotedStringChar();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseUnquotedStringChar();
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c80(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c77);
        }
      }

      return s0;
    }

    function peg$parseDoubleStringChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c83.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c84);
        }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c85);
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c86(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s1 = peg$c87;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c88);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseEscapeSequence();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c86(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseSingleStringChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c89.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c90);
        }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c85);
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c86(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s1 = peg$c87;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c88);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseEscapeSequence();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c86(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseUnquotedStringChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parsews();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c85);
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c86(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEscapeSequence() {
      var s0, s1;

      if (peg$c91.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c92);
        }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 110) {
          s1 = peg$c93;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c94);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c95();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 114) {
            s1 = peg$c96;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c97);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c98();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 116) {
              s1 = peg$c99;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c101();
            }
            s0 = s1;
          }
        }
      }

      return s0;
    }

    var flowutils = require("../flow/utils.js");

    function or(first, second) {
      // Add explicit function names to ease debugging.
      function orFilter() {
        return first.apply(this, arguments) || second.apply(this, arguments);
      }
      orFilter.desc = first.desc + " or " + second.desc;
      return orFilter;
    }
    function and(first, second) {
      function andFilter() {
        return first.apply(this, arguments) && second.apply(this, arguments);
      }
      andFilter.desc = first.desc + " and " + second.desc;
      return andFilter;
    }
    function not(expr) {
      function notFilter() {
        return !expr.apply(this, arguments);
      }
      notFilter.desc = "not " + expr.desc;
      return notFilter;
    }
    function binding(expr) {
      function bindingFilter() {
        return expr.apply(this, arguments);
      }
      bindingFilter.desc = "(" + expr.desc + ")";
      return bindingFilter;
    }
    function trueFilter(flow) {
      return true;
    }
    trueFilter.desc = "true";
    function falseFilter(flow) {
      return false;
    }
    falseFilter.desc = "false";

    var ASSET_TYPES = [new RegExp("text/javascript"), new RegExp("application/x-javascript"), new RegExp("application/javascript"), new RegExp("text/css"), new RegExp("image/.*"), new RegExp("application/x-shockwave-flash")];
    function assetFilter(flow) {
      if (flow.response) {
        var ct = flowutils.ResponseUtils.getContentType(flow.response);
        var i = ASSET_TYPES.length;
        while (i--) {
          if (ASSET_TYPES[i].test(ct)) {
            return true;
          }
        }
      }
      return false;
    }
    assetFilter.desc = "is asset";
    function responseCode(code) {
      function responseCodeFilter(flow) {
        return flow.response && flow.response.status_code === code;
      }
      responseCodeFilter.desc = "resp. code is " + code;
      return responseCodeFilter;
    }
    function domain(regex) {
      regex = new RegExp(regex, "i");
      function domainFilter(flow) {
        return flow.request && regex.test(flow.request.host);
      }
      domainFilter.desc = "domain matches " + regex;
      return domainFilter;
    }
    function errorFilter(flow) {
      return !!flow.error;
    }
    errorFilter.desc = "has error";
    function header(regex) {
      regex = new RegExp(regex, "i");
      function headerFilter(flow) {
        return flow.request && flowutils.RequestUtils.match_header(flow.request, regex) || flow.response && flowutils.ResponseUtils.match_header(flow.response, regex);
      }
      headerFilter.desc = "header matches " + regex;
      return headerFilter;
    }
    function requestHeader(regex) {
      regex = new RegExp(regex, "i");
      function requestHeaderFilter(flow) {
        return flow.request && flowutils.RequestUtils.match_header(flow.request, regex);
      }
      requestHeaderFilter.desc = "req. header matches " + regex;
      return requestHeaderFilter;
    }
    function responseHeader(regex) {
      regex = new RegExp(regex, "i");
      function responseHeaderFilter(flow) {
        return flow.response && flowutils.ResponseUtils.match_header(flow.response, regex);
      }
      responseHeaderFilter.desc = "resp. header matches " + regex;
      return responseHeaderFilter;
    }
    function method(regex) {
      regex = new RegExp(regex, "i");
      function methodFilter(flow) {
        return flow.request && regex.test(flow.request.method);
      }
      methodFilter.desc = "method matches " + regex;
      return methodFilter;
    }
    function noResponseFilter(flow) {
      return flow.request && !flow.response;
    }
    noResponseFilter.desc = "has no response";
    function responseFilter(flow) {
      return !!flow.response;
    }
    responseFilter.desc = "has response";

    function contentType(regex) {
      regex = new RegExp(regex, "i");
      function contentTypeFilter(flow) {
        return flow.request && regex.test(flowutils.RequestUtils.getContentType(flow.request)) || flow.response && regex.test(flowutils.ResponseUtils.getContentType(flow.response));
      }
      contentTypeFilter.desc = "content type matches " + regex;
      return contentTypeFilter;
    }
    function requestContentType(regex) {
      regex = new RegExp(regex, "i");
      function requestContentTypeFilter(flow) {
        return flow.request && regex.test(flowutils.RequestUtils.getContentType(flow.request));
      }
      requestContentTypeFilter.desc = "req. content type matches " + regex;
      return requestContentTypeFilter;
    }
    function responseContentType(regex) {
      regex = new RegExp(regex, "i");
      function responseContentTypeFilter(flow) {
        return flow.response && regex.test(flowutils.ResponseUtils.getContentType(flow.response));
      }
      responseContentTypeFilter.desc = "resp. content type matches " + regex;
      return responseContentTypeFilter;
    }
    function url(regex) {
      regex = new RegExp(regex, "i");
      function urlFilter(flow) {
        return flow.request && regex.test(flowutils.RequestUtils.pretty_url(flow.request));
      }
      urlFilter.desc = "url matches " + regex;
      return urlFilter;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse
  };
}();

},{"../flow/utils.js":55}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseHttpVersion = exports.isValidHttpVersion = exports.parseUrl = exports.ResponseUtils = exports.RequestUtils = exports.MessageUtils = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultPorts = {
    "http": 80,
    "https": 443
};

var MessageUtils = exports.MessageUtils = {
    getContentType: function getContentType(message) {
        var ct = this.get_first_header(message, /^Content-Type$/i);
        if (ct) {
            return ct.split(";")[0].trim();
        }
    },
    get_first_header: function get_first_header(message, regex) {
        //FIXME: Cache Invalidation.
        if (!message._headerLookups) Object.defineProperty(message, "_headerLookups", {
            value: {},
            configurable: false,
            enumerable: false,
            writable: false
        });
        if (!(regex in message._headerLookups)) {
            var header;
            for (var i = 0; i < message.headers.length; i++) {
                if (!!message.headers[i][0].match(regex)) {
                    header = message.headers[i];
                    break;
                }
            }
            message._headerLookups[regex] = header ? header[1] : undefined;
        }
        return message._headerLookups[regex];
    },
    match_header: function match_header(message, regex) {
        var headers = message.headers;
        var i = headers.length;
        while (i--) {
            if (regex.test(headers[i].join(" "))) {
                return headers[i];
            }
        }
        return false;
    },
    getContentURL: function getContentURL(flow, message) {
        if (message === flow.request) {
            message = "request";
        } else if (message === flow.response) {
            message = "response";
        }
        return "/flows/" + flow.id + "/" + message + "/content";
    }
};

var RequestUtils = exports.RequestUtils = _lodash2.default.extend(MessageUtils, {
    pretty_host: function pretty_host(request) {
        //FIXME: Add hostheader
        return request.host;
    },
    pretty_url: function pretty_url(request) {
        var port = "";
        if (defaultPorts[request.scheme] !== request.port) {
            port = ":" + request.port;
        }
        return request.scheme + "://" + this.pretty_host(request) + port + request.path;
    }
});

var ResponseUtils = exports.ResponseUtils = _lodash2.default.extend(MessageUtils, {});

var parseUrl_regex = /^(?:(https?):\/\/)?([^\/:]+)?(?::(\d+))?(\/.*)?$/i;
var parseUrl = exports.parseUrl = function parseUrl(url) {
    //there are many correct ways to parse a URL,
    //however, a mitmproxy user may also wish to generate a not-so-correct URL. ;-)
    var parts = parseUrl_regex.exec(url);
    if (!parts) {
        return false;
    }

    var scheme = parts[1],
        host = parts[2],
        port = parseInt(parts[3]),
        path = parts[4];
    if (scheme) {
        port = port || defaultPorts[scheme];
    }
    var ret = {};
    if (scheme) {
        ret.scheme = scheme;
    }
    if (host) {
        ret.host = host;
    }
    if (port) {
        ret.port = port;
    }
    if (path) {
        ret.path = path;
    }
    return ret;
};

var isValidHttpVersion_regex = /^HTTP\/\d+(\.\d+)*$/i;
var isValidHttpVersion = exports.isValidHttpVersion = function isValidHttpVersion(httpVersion) {
    return isValidHttpVersion_regex.test(httpVersion);
};

var parseHttpVersion = exports.parseHttpVersion = function parseHttpVersion(httpVersion) {
    httpVersion = httpVersion.replace("HTTP/", "").split(".");
    return _lodash2.default.map(httpVersion, function (x) {
        return parseInt(x);
    });
};

},{"lodash":"lodash"}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatTimeStamp = exports.formatTimeDelta = exports.formatSize = exports.Key = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.reverseString = reverseString;
exports.fetchApi = fetchApi;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window._ = _lodash2.default;
window.React = require("react");

var Key = exports.Key = {
    UP: 38,
    DOWN: 40,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    ESC: 27,
    TAB: 9,
    SPACE: 32,
    BACKSPACE: 8,
    SHIFT: 16
};
// Add A-Z
for (var i = 65; i <= 90; i++) {
    Key[String.fromCharCode(i)] = i;
}

var formatSize = exports.formatSize = function formatSize(bytes) {
    if (bytes === 0) return "0";
    var prefix = ["b", "kb", "mb", "gb", "tb"];
    for (var i = 0; i < prefix.length; i++) {
        if (Math.pow(1024, i + 1) > bytes) {
            break;
        }
    }
    var precision;
    if (bytes % Math.pow(1024, i) === 0) precision = 0;else precision = 1;
    return (bytes / Math.pow(1024, i)).toFixed(precision) + prefix[i];
};

var formatTimeDelta = exports.formatTimeDelta = function formatTimeDelta(milliseconds) {
    var time = milliseconds;
    var prefix = ["ms", "s", "min", "h"];
    var div = [1000, 60, 60];
    var i = 0;
    while (Math.abs(time) >= div[i] && i < div.length) {
        time = time / div[i];
        i++;
    }
    return Math.round(time) + prefix[i];
};

var formatTimeStamp = exports.formatTimeStamp = function formatTimeStamp(seconds) {
    var ts = new Date(seconds * 1000).toISOString();
    return ts.replace("T", " ").replace("Z", "");
};

// At some places, we need to sort strings alphabetically descending,
// but we can only provide a key function.
// This beauty "reverses" a JS string.
var end = String.fromCharCode(0xffff);
function reverseString(s) {
    return String.fromCharCode.apply(String, _lodash2.default.map(s.split(""), function (c) {
        return 0xffff - c.charCodeAt(0);
    })) + end;
}

function getCookie(name) {
    var r = document.cookie.match(new RegExp("\\b" + name + "=([^;]*)\\b"));
    return r ? r[1] : undefined;
}
var xsrf = "_xsrf=" + getCookie("_xsrf");

function fetchApi(url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (options.method && options.method !== "GET") {
        if (url.indexOf("?") === -1) {
            url += "?" + xsrf;
        } else {
            url += "&" + xsrf;
        }
    }

    return fetch(url, _extends({
        credentials: 'same-origin'
    }, options));
}

fetchApi.put = function (url, json, options) {
    return fetchApi(url, _extends({
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }, options));
};

},{"lodash":"lodash","react":"react"}]},{},[3])


//# sourceMappingURL=app.js.map
