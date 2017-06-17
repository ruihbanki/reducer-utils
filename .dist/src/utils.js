'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function logDifferences(state, newState) {
    let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    if (level === 1) {
        console.log('STATE DIFFERENCE');
    }
    for (key in newState) {
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
    logDifferences: logDifferences
};