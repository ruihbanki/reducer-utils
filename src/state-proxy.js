function createStateProxy(state) {
    let clone = null;
    const manager = {
        clone(prop) {
            if (!clone) {
                clone = {...state};
            }
            const clonedProp = cloneProp(clone, prop);
            clone[prop] = clonedProp;
            return clonedProp;
        },
        getCloneState() {
            return cloneState || state
        },
    };
    const handler = {
        get: function(obj, prop) {
            if (prop === 'getNewState') {
                return function () {
                    return clone || state;
                }
            }
            const target = clone || obj;
            return returnGet(target, prop, manager);            
        },
        set: function(obj, prop, value) {
            if (!clone) {
                clone = {...state};
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

function createProxyObject(obj, objProp, parentManager) {
    console.log('createProxyObject', objProp)
    let clone = null;
    const manager = {
        clone(prop) {
            if (!clone) {
                clone = parentManager.clone(objProp);
            }
            const clonedProp = cloneProp(clone, prop);
            clone[prop] = clonedProp;
            return clonedProp;
        },
    };
    const handler = {
        get: function(obj, prop) {
            const target = clone || obj;
            return returnGet(target, prop, manager);
        },
        set: function(obj, prop, value) {
            if (!clone) {
                clone = parentManager.clone(objProp);
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

function cloneProp(obj, prop) {
    const value = obj[prop];
    if (Array.isArray(value)) { 
        return [...value];
    } else {
        return {...value};
    }
}

function returnGet(obj, prop, manager) {
    console.log('returnGet', prop);
    if (prop === '__isProxy') {
        return true;
    } else if (prop === '__object') {
        return obj;
    }

    const value = obj[prop];
    if (!value) {
        return value;
    } else  if (value instanceof Function) {
        return value;
    } else if (value instanceof Object) {
        console.log('============', value.__isProxy);
        if (value.__isProxy) {
            return value;
        } else {
            return createProxyObject(value, prop, manager);
        }
    } else {
        return value;
    }
}

export default createStateProxy;
