
function createProxyState(state) {
    let cloneState = null;
    const manager = {
        clone(prop) {
            if (!cloneState) {
                cloneState = Object.assign({}, state);
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            return clone;
        }
    };
    const handler = {
        get: function(target, name) {
            const obj = cloneState || target;
            return returnGet(obj, name, manager);            
        },
        set: function(obj, prop, value) {
            if (!cloneState) {
                cloneState = Object.assign({}, state);
            }            
            cloneState[prop] = value;            
        }
    };
    const proxy = new Proxy(state, handler);    
    return {
        getProxy: function() {
            return proxy;
        },
        getNewState: function() {
            return cloneState || state;
        }
    }
}

function createProxyObject(object, objectProp, parentManager) {
    let cloneState = null;
    const manager = {
        clone(prop) {
            if (!cloneState) {
                cloneState = parentManager.clone(objectProp);
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            return clone;
        }
    };
    const handler = {
        get: function(target, name) {
            const obj = cloneState || target;
            return returnGet(obj, name, manager);
        },
        set: function(obj, prop, value) {
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
    }else if (value instanceof Object) {
        return createProxyObject(value, name, manager);
    } else {
        return value;
    }
}
