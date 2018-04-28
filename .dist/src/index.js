'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reducerStateProxy = exports.createStateProxy = undefined;

var _stateProxy = require('./state-proxy');

var _stateProxy2 = _interopRequireDefault(_stateProxy);

var _reducerStateProxy = require('./reducer-state-proxy');

var _reducerStateProxy2 = _interopRequireDefault(_reducerStateProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createStateProxy = _stateProxy2.default;
exports.reducerStateProxy = _reducerStateProxy2.default;
exports.default = {
    createStateProxy: _stateProxy2.default,
    reducerStateProxy: _reducerStateProxy2.default
};