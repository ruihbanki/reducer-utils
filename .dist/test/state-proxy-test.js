'use strict';

var _chai = require('chai');

var _stateProxy = require('../src/state-proxy');

var _stateProxy2 = _interopRequireDefault(_stateProxy);

var _utils = require('../src/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('#proxy-state', function () {
    it('should not create a new state if no one modification was made in the proxy', function () {
        const state = {};
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        const newState = proxyState.getNewState();
        (0, _chai.expect)(newState).to.equal(state);
    });
});

describe('#proxy-state', function () {
    it('should create a new state if some modification was made in the proxy', function () {
        const state = {};
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        proxy.newProperty = true;
        const newState = proxyState.getNewState();
        (0, _chai.expect)(newState).to.not.equal(state);
    });
});

describe('#proxy-state', function () {
    it('should create a new property if some modification was made in the proxy', function () {
        const state = {
            property1: {},
            property2: {}
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        proxy.property1 = {};
        const newState = proxyState.getNewState();
        (0, _chai.expect)(newState.property1).to.not.equal(state.property1);
    });
});

describe('#proxy-state', function () {
    it('should not create a new property if no one modification was made in the property', function () {
        const state = {
            property1: {},
            property2: {}
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        proxy.property1 = {};
        const newState = proxyState.getNewState();
        (0, _chai.expect)(newState.property2).to.equal(state.property2);
    });
});

describe('#proxy-state', function () {
    it('should not modificate the state when is made modifications in the proxy', function () {
        const state = {
            property1: {},
            property2: {},
            propertyArray: [{
                property3: 1
            }]
        };
        const copyState = deepCopy(state);
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        proxy.property1 = {};
        proxy.propertyArray[0].property3 = 2;
        proxy.propertyArray.push({});
        proxy.propertyArray.push({});
        proxy.propertyArray.push({});
        proxy.propertyArray.pop();
        proxy.propertyArray.shift();
        proxy.propertyArray.splice(0, 1, {});
        const newState = proxyState.getNewState();
        (0, _chai.expect)(state).to.deep.equal(copyState);
    });
});

describe('#proxy-state', function () {
    it('should create a new property if the property of the proxy was changed', function () {
        const state = {
            property1: {},
            property2: {},
            propertyArray: [{
                property3: 1
            }]
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        proxy.propertyArray[0].property3 = 2;
        const newState = proxyState.getNewState();
        (0, _chai.expect)(state.propertyArray).to.not.equal(newState.propertyArray);
    });
});

describe('#proxy-state', function () {
    it('should create a new property to each nested property when the proxy is changed', function () {
        const state = {
            property1: {
                property2: [{
                    property3: {
                        property4: {
                            property5: true
                        }
                    }
                }]
            }
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        proxy.property1.property2[0].property3.property4.property5 = false;
        const newState = proxyState.getNewState();
        (0, _chai.expect)(state.property1).to.not.equal(newState.property1);
        (0, _chai.expect)(state.property1.property2).to.not.equal(newState.property1.property2);
        (0, _chai.expect)(state.property1.property2[0]).to.not.equal(newState.property1.property2[0]);
        (0, _chai.expect)(state.property1.property2[0].property3).to.not.equal(newState.property1.property2[0].property3);
        (0, _chai.expect)(state.property1.property2[0].property3.property4).to.not.equal(newState.property1.property2[0].property3.property4);
    });
});

describe('#proxy-state', function () {
    it('should support push in arrays', function () {
        const state = {
            property1: {
                property2: [{
                    property3: {
                        property4: {
                            property5: true
                        }
                    }
                }]
            }
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        const property2 = proxy.property1.property2;
        property2.push({ type: 'new' });
        const newState = proxyState.getNewState();
        //utils.logDifferences(state, newState);
        //console.log('=========================', JSON.stringify(newState, null, 2))
    });
});

describe('#proxy-state', function () {
    it('should support setting properties at indexes', function () {
        const state = {
            people: [{
                name: 'Jonh'
            }, {
                name: 'Anna'
            }]
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        const people = proxy.people;
        people[1] = { name: 'Paul' };
        const newState = proxyState.getNewState();
        _utils2.default.logDifferences(state, newState);
        //console.log('=========================', JSON.stringify(newState, null, 2))
    });
});

describe('#proxy-state', function () {
    it.only('should support setting properties at indexes', function () {
        const state = {
            people: [{
                name: 'Jonh'
            }, {
                name: 'Anna'
            }, {
                name: 'Tom'
            }, {
                name: 'Jerry'
            }]
        };
        const proxyState = (0, _stateProxy2.default)(state);
        const proxy = proxyState.getProxy();
        const people = proxy.people;
        people.splice(1, 0, { name: 'Paul' });
        const newState = proxyState.getNewState();
        _utils2.default.logDifferences(state, newState);
        console.log('=========================', people.length, JSON.stringify(newState, null, 2));
    });
});

function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}