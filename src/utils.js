function findByProperty(items, propName, propValue) {
    for (let item of items) {
        if (item[propName] === propValue) {
            return item;
        }
    }
    return null;
}

function findById(items, id) {
    return findByProperty(items, 'id', id);
}

function findNestedByProperty(items, propName, propValue, propChildren = 'children') {
    for (let item of items) {
        if (item[propName] === propValue) {
            return item;
        }
        let children = item[propChildren];
        if (children) {
            let find = findNestedByProperty(children, propName, propValue, propChildren);
            if (find) {
                return find;
            }
        }
    }
    return null;
}

function findNestedById(items, id, propChildren = 'children') {
    return findNestedByProperty(items, 'id', id, propChildren);
}

function deleteByProperty(items, propName, propValue) {
    let index = -1;
    for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i];
        if (item[propName] === propValue) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        items.splice(index, 1);
        return true;
    }
    return false;
}

function deleteById(items, id) {
    return deleteByProperty(items, 'id', id);
}

function deleteNestedByProperty(items, propName, propValue, propChildren = 'children') {
    let index = -1;
    for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i];
        if (item[propName] === propValue) {
            index = i;
            break;
        }
        let children = item[propChildren];
        if (children) {
            let deleted = deleteNestedByProperty(children, propName, propValue, propChildren);
            if (deleted > -1) {
                return true;
            }
        }
    }
    if (index > -1) {
        items.splice(index, 1);
        return true;
    }
    return false;
}

function deleteNestedById(items, id, propChildren = 'children') {
    return deleteNestedByProperty(items, 'id', id, propChildren);
}

function createItemsByProperty(items, propKey, propChildren = 'children') {
    const itemsBy = {};
    for (let item of items) {
        if (item) {
            const key = item[propKey];
            itemsBy[key] = item;
            let children = item[propChildren];
            if (children) {
                addItemsByProperty(itemsBy, children, propKey, propChildren);
            }
        }
    }
    return itemsBy;
}

function addItemsByProperty(itemsBy, items, propKey, propChildren = 'children') {
    for (let item of items) {
        if (item) {
            const key = item[propKey];
            itemsBy[key] = item;
            let children = item[propChildren];
            if (children) {
                addItemsByProperty(itemsBy, children, propKey, propChildren);
            }
        }
    }
}

function createItemsById(items, propChildren = 'children') {
    return createItemsByProperty(items, 'id', propChildren);
}

function logDifferences(state, newState, level = 1) {
    if (level === 1) {
        console.log('STATE DIFFERENCE');
    }    
    for (key in newState) {
        const newStateValue = newState[key];
        if (newStateValue instanceof Object) {
            const stateValue = state[key];
            if (stateValue !== newStateValue) {                
                console.log(Array(level + 1).join('-') + ' ' +  key);
                if (stateValue && newStateValue) {
                    logDifferences(stateValue, newStateValue, level + 2);
                }          
            }
        }
    }
}

export default {
    findByProperty,
    findById,
    findNestedByProperty,
    findNestedById,
    deleteByProperty,
    deleteById,
    deleteNestedByProperty,
    deleteNestedById,
    createItemsByProperty,
    createItemsById,
    logDifferences
};
