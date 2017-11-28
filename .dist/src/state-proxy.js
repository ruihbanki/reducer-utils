'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function createStateProxy(state) {
    let cloneState = null;
    const manager = {
        clone: function clone(prop) {
            if (!cloneState) {
                cloneState = Object.assign({}, state);
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            return clone;
        },
        getCloneState: function getCloneState() {
            return cloneState || state;
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
            if (value.__isProxy) {
                value = value.__object;
            }
            cloneState[prop] = value;
            return true;
        }
    };
    return new Proxy(state, handler);
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
        },
        getCloneState: function getCloneState() {
            return parentManagergetCloneState();
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
            if (value.__isProxy) {
                value = value.__object;
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

    switch (name) {
        case '__object':
            return obj;
        case '__isProxy':
            return true;
        case 'getNewState':
            return manager.getCloneState;
        default:
        // continue
    }
    if (value instanceof Function) {
        return value;
    } else if (value instanceof Object) {
        return createProxyObject(value, name, manager);
    } else {
        return value;
    }
}

exports.default = createStateProxy;