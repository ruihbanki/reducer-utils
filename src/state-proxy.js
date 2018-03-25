function createStateProxy(state) {
    let clone = null;
    let proxiesMap = {};

    const manager = {
        createCloneProp(prop) {
            if (!clone) {
                clone = {...state};
            }
            return returnCloneProp(state, clone, prop);
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
            if (value != null && value.__isProxy) {
                value = value.__object;
            }
            clone[prop] = value; 
            return true;       
        },
        deleteProperty(target, prop) {
            if (prop in target) {
                if (!clone) {
                    clone = {...state};
                }
                delete clone[prop];
                return true;
            }
        },
    };

    return new Proxy(state, handler);
}

function returnCloneProp(state, clone, prop) {
    let objectProp = clone[prop];
    const objectOriginal = state[prop];
    if (objectProp === objectOriginal) {
        if (Array.isArray(objectProp)) { 
            objectProp = [...objectProp];
        } else {
            objectProp = {...objectProp};
        }
        clone[prop] = objectProp;
    }
    return objectProp;
}

function createProxyObject(obj, objProp, parentManager) {
    let clone = null;
    let proxiesMap = {};

    const manager = {
        createCloneProp(prop) {
            if (!clone) {
                clone = parentManager.createCloneProp(objProp);
            }
            return returnCloneProp(obj, clone, prop);
        },
    };

    const handler = {
        get: function(obj, prop) {
            const target = clone || obj;
            return returnGet(target, prop, manager, proxiesMap);
        },
        set: function(obj, prop, value) {
            if (!clone) {
                clone = parentManager.createCloneProp(objProp);
            }            
            if (value != null && value.__isProxy) {
                value = value.__object;
            }
            clone[prop] = value;  
            return true;          
        },
        deleteProperty(target, prop) {
            if (prop in target) {
                if (!clone) {
                    clone = parentManager.createCloneProp(objProp);
                }
                delete clone[prop];
                return true;
            }
        },
    };

    return new Proxy(obj, handler); 
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
