function createStateProxy(state) {
    let clone = null;
    let proxiesMap = {};
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
            return returnGet(target, prop, manager, proxiesMap);            
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
    let clone = null;
    let proxiesMap = {};
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
            return returnGet(target, prop, manager, proxiesMap);
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
    } else  if (value instanceof Function) {
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

export default createStateProxy;
