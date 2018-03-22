'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

function findNestedByProperty(items, propName, propValue) {
    let propChildren = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'children';

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

function findNestedById(items, id) {
    let propChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';

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

function deleteNestedByProperty(items, propName, propValue) {
    let propChildren = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'children';

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

function deleteNestedById(items, id) {
    let propChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';

    return deleteNestedByProperty(items, 'id', id, propChildren);
}

function createItemsByProperty(items, propKey) {
    let propChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';

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

function addItemsByProperty(itemsBy, items, propKey) {
    let propChildren = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'children';

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

function createItemsById(items) {
    let propChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'children';

    return createItemsByProperty(items, 'id', propChildren);
}

function logDifferences(state, newState) {
    let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    if (level === 1) {
        console.log('STATE DIFFERENCE');
    }
    for (let key in newState) {
        const newStateValue = newState[key];
        if (newStateValue instanceof Object) {
            const stateValue = state[key];
            if (stateValue !== newStateValue) {
                console.log(Array(level + 1).join('-') + ' ' + key);
                if (stateValue && newStateValue) {
                    logDifferences(stateValue, newStateValue, level + 2);
                }
            }
        }
    }
}

exports.default = {
    findByProperty: findByProperty,
    findById: findById,
    findNestedByProperty: findNestedByProperty,
    findNestedById: findNestedById,
    deleteByProperty: deleteByProperty,
    deleteById: deleteById,
    deleteNestedByProperty: deleteNestedByProperty,
    deleteNestedById: deleteNestedById,
    createItemsByProperty: createItemsByProperty,
    createItemsById: createItemsById,
    logDifferences: logDifferences
};