function createStateProxy(state) {
    let cloneState = null;
    const manager = {
        clone(prop) {
            if (!cloneState) {
                cloneState = {...state};
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            console.log('clone parent:', clone);
            return clone;
        },
        getCloneState() {
            return cloneState || state
        },
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
        clone(prop) {
            if (!cloneState) {
                cloneState = parentManager.clone(objectProp);
            }
            const clone = cloneProp(cloneState, prop);
            cloneState[prop] = clone;
            console.log('clone:', clone);
            return clone;
        },
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
        cloneProp = [...obj[prop]];
    } else {
        cloneProp = {...obj[prop]};
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
    }else if (value instanceof Object) {
        return createProxyObject(value, name, manager);
    } else {
        return value;
    }
}

export default createStateProxy;
