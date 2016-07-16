import _ from "lodash";

window._ = _;
window.React = require("react");

export var Key = {
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


export var formatSize = function (bytes) {
    if (bytes === 0)
        return "0";
    var prefix = ["b", "kb", "mb", "gb", "tb"];
    for (var i = 0; i < prefix.length; i++) {
        if (Math.pow(1024, i + 1) > bytes) {
            break;
        }
    }
    var precision;
    if (bytes % Math.pow(1024, i) === 0)
        precision = 0;
    else
        precision = 1;
    return (bytes / Math.pow(1024, i)).toFixed(precision) + prefix[i];
};


export var formatTimeDelta = function (milliseconds) {
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


export var formatTimeStamp = function (seconds) {
    var ts = (new Date(seconds * 1000)).toISOString();
    return ts.replace("T", " ").replace("Z", "");
};

// At some places, we need to sort strings alphabetically descending,
// but we can only provide a key function.
// This beauty "reverses" a JS string.
var end = String.fromCharCode(0xffff);
export function reverseString(s) {
    return String.fromCharCode.apply(String,
            _.map(s.split(""), function (c) {
                return 0xffff - c.charCodeAt(0);
            })
        ) + end;
}

function getCookie(name) {
    var r = document.cookie.match(new RegExp("\\b" + name + "=([^;]*)\\b"));
    return r ? r[1] : undefined;
}
const xsrf = `_xsrf=${getCookie("_xsrf")}`;

export function fetchApi(url, options={}) {
    if (options.method && options.method !== "GET") {
        if (url.indexOf("?") === -1) {
            url += "?" + xsrf;
        } else {
            url += "&" + xsrf;
        }
    }

    return fetch(url, {
        credentials: 'same-origin',
        ...options
    });
}

fetchApi.put = (url, json, options) => fetchApi(
    url,
    {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
        ...options
    }
)

export function deepEquals(a, b, precise = true) {
    if (typeof(a) !== 'object' || typeof(b) !== 'object' || !a || !b) {
        return precise ? a === b : a == b
    }
    let keys = [ ...Object.keys(a), ...Object.keys(b)]
    for (let k of keys) {
        if (!deepEquals(a[k], b[k], precise)) {
            return false
        }
    }
    return true
}
