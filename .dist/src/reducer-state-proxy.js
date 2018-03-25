'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stateProxy = require('./state-proxy');

var _stateProxy2 = _interopRequireDefault(_stateProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducerStateProxy = reducer => {
    return (state, action) => {
        if (action.type.substr(0, 2) === '@@') {
            return reducer(state, action);
        }
        const stateProxy = (0, _stateProxy2.default)(state);
        reducer(stateProxy, action);
        return stateProxy.getNewState();
    };
};

exports.default = reducerStateProxy;