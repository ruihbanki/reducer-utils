'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reducerStateProxy = undefined;

var _stateProxy = require('./state-proxy');

var _stateProxy2 = _interopRequireDefault(_stateProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducerStateProxy = exports.reducerStateProxy = (state, action) => {
    return reducer => {
        const stateProxy = (0, _stateProxy2.default)(state);
        const stateResult = reducer(stateProxy, reducer);
        return stateResult.getNewState();
    };
};

exports.default = reducerStateProxy;