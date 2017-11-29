'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function createStateProxy(state) {
    let _clone = null;
    let proxiesMap = {};
    const manager = {
        clone: function clone(prop) {
            if (!_clone) {
                _clone = _extends({}, state);
            }
            const clonedProp = cloneProp(_clone, prop);
            _clone[prop] = clonedProp;
            return clonedProp;
        },
        getCloneState: function getCloneState() {
            return cloneState || state;
        }
    };
    const handler = {
        get: function get(obj, prop) {
            if (prop === 'getNewState') {
                return function () {
                    return _clone || state;
                };
            }
            const target = _clone || obj;
            return returnGet(target, prop, manager, proxiesMap);
        },
        set: function set(obj, prop, value) {
            if (!_clone) {
                _clone = _extends({}, state);
            }
            if (value.__isProxy) {
                value = value.__object;
            }
            _clone[prop] = value;
            return true;
        }
    };
    const proxy = new Proxy(state, handler);
    return proxy;
}

function createProxyObject(obj, objProp, parentManager) {
    console.log('createProxyObject', objProp);
    let _clone2 = null;
    let proxiesMap = {};
    const manager = {
        clone: function clone(prop) {
            if (!_clone2) {
                _clone2 = parentManager.clone(objProp);
            }
            const clonedProp = cloneProp(_clone2, prop);
            _clone2[prop] = clonedProp;
            return clonedProp;
        }
    };
    const handler = {
        get: function get(obj, prop) {
            const target = _clone2 || obj;
            return returnGet(target, prop, manager, proxiesMap);
        },
        set: function set(obj, prop, value) {
            if (!_clone2) {
                _clone2 = parentManager.clone(objProp);
            }
            if (value.__isProxy) {
                value = value.__object;
            }
            _clone2[prop] = value;
            return true;
        }
    };
    const proxy = new Proxy(obj, handler);
    return proxy;
};

function cloneProp(obj, prop) {
    const value = obj[prop];
    if (Array.isArray(value)) {
        return [...value];
    } else {
        return _extends({}, value);
    }
}

function returnGet(obj, prop, manager, proxiesMap) {
    console.log('returnGet', prop);
    if (prop === '__isProxy') {
        return true;
    } else if (prop === '__object') {
        return obj;
    }

    const value = obj[prop];
    let proxy = proxiesMap[prop];
    if (!value) {
        return value;
    } else if (value instanceof Function) {
        return value;
    } else if (value instanceof Object) {
        console.log('============', value.__isProxy);
        if (!proxy) {
            proxy = createProxyObject(value, prop, manager);
            proxiesMap[prop] = proxy;
        }
        return proxy;
    } else {
        return value;
    }
}

exports.default = createStateProxy;