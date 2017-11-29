'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function createStateProxy(state) {
    let clone = null;
    let proxiesMap = {};

    const manager = {
        createCloneProp: function createCloneProp(prop) {
            if (!clone) {
                clone = _extends({}, state);
            }
            return returnCloneProp(state, clone, prop);
        }
    };

    const handler = {
        get: function get(obj, prop) {
            if (prop === 'getNewState') {
                return function () {
                    return clone || state;
                };
            }
            const target = clone || obj;
            return returnGet(target, prop, manager, proxiesMap);
        },
        set: function set(obj, prop, value) {
            if (!clone) {
                clone = _extends({}, state);
            }
            if (value.__isProxy) {
                value = value.__object;
            }
            clone[prop] = value;
            return true;
        }
    };

    const proxy = new Proxy(state, handler);
    return proxy;
}

function returnCloneProp(state, clone, prop) {
    let objectProp = clone[prop];
    const objectOriginal = state[prop];
    if (objectProp === objectOriginal) {
        if (Array.isArray(objectProp)) {
            objectProp = [...objectProp];
        } else {
            objectProp = _extends({}, objectProp);
        }
        clone[prop] = objectProp;
    }
    return objectProp;
}

function createProxyObject(obj, objProp, parentManager) {
    let clone = null;
    let proxiesMap = {};

    const manager = {
        createCloneProp: function createCloneProp(prop) {
            if (!clone) {
                clone = parentManager.createCloneProp(objProp);
            }
            return returnCloneProp(obj, clone, prop);
        }
    };

    const handler = {
        get: function get(obj, prop) {
            const target = clone || obj;
            return returnGet(target, prop, manager, proxiesMap);
        },
        set: function set(obj, prop, value) {
            if (!clone) {
                clone = parentManager.createCloneProp(objProp);
            }
            if (value.__isProxy) {
                value = value.__object;
            }
            clone[prop] = value;
            return true;
        }
    };

    const proxy = new Proxy(obj, handler);
    return proxy;
};

function returnGet(obj, prop, manager, proxiesMap) {
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