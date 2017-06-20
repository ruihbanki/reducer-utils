"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createProxyState;
function createProxyState(state) {
    let cloneState = null;
    const manager = {
        clone: function clone(prop) {
            if (!cloneState) {
                cloneState = Object.assign({}, state);
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            return clone;
        }
    };
    const handler = {
        get: function get(target, name) {
            const obj = cloneState || target;
            return returnGet(obj, name, manager);
        },
        set: function set(obj, prop, value) {
            if (!cloneState) {
                cloneState = Object.assign({}, state);
            }
            cloneState[prop] = value;
            return true;
        }
    };
    const proxy = new Proxy(state, handler);
    return {
        getProxy: function getProxy() {
            return proxy;
        },
        getNewState: function getNewState() {
            return cloneState || state;
        }
    };
}

function createProxyObject(object, objectProp, parentManager) {
    let cloneState = null;
    const manager = {
        clone: function clone(prop) {
            if (!cloneState) {
                cloneState = parentManager.clone(objectProp);
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            return clone;
        }
    };
    const handler = {
        get: function get(target, name) {
            const obj = cloneState || target;
            return returnGet(obj, name, manager);
        },
        set: function set(obj, prop, value) {
            if (!cloneState) {
                cloneState = parentManager.clone(objectProp);
            }
            cloneState[prop] = value;
            return true;
        }
    };
    return new Proxy(object, handler);
};

function cloneProp(obj, prop) {
    let cloneProp = null;
    if (Array.isArray(obj[prop])) {
        cloneProp = obj[prop].concat();
    } else {
        cloneProp = Object.assign({}, obj[prop]);
    }
    return cloneProp;
}

function returnGet(obj, name, manager) {
    const value = obj[name];
    if (value instanceof Function) {
        return value;
    } else if (value instanceof Object) {
        return createProxyObject(value, name, manager);
    } else {
        return value;
    }
}