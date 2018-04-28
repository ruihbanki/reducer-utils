'use strict';

var _chai = require('chai');

var _reducerStateProxy = require('../src/reducer-state-proxy');

var _reducerStateProxy2 = _interopRequireDefault(_reducerStateProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let state = null;
beforeEach(function () {
    state = {
        products: [{
            id: 1,
            name: 'Nokia'
        }, {
            id: 2,
            name: 'Iphone'
        }, {
            id: 3,
            name: 'Galaxy'
        }],
        tree: [{
            id: 1,
            name: 'Item 1',
            children: [{
                id: 2,
                name: 'Item 1.1',
                children: [{
                    id: 3,
                    name: 'Item 1.1.1'
                }]
            }, {
                id: 4,
                name: 'Item 1.2'
            }]
        }, {
            id: 5,
            name: 'Item 2'
        }],
        user: {
            name: 'Jonh',
            roles: [{
                id: 1,
                name: 'Engineer'
            }, {
                id: 2,
                name: 'Manager'
            }],
            roleActive: {
                id: 2,
                name: 'Manager'
            }
        }
    };
});

describe('when not change the state', function () {
    let newState = null;
    beforeEach(function () {
        const reducer = (state, action) => {};
        newState = (0, _reducerStateProxy2.default)(reducer)(state, {
            type: 'NOTHING'
        });
    });

    it('should not create a new state', function () {
        (0, _chai.expect)(newState).to.equal(state);
    });
});

describe('when add an item to an array', function () {
    let newState = null;
    beforeEach(function () {
        const reducer = (state, action) => {
            state.products.push(action.product);
        };
        newState = (0, _reducerStateProxy2.default)(reducer)(state, {
            type: 'ADD_PRODUCT',
            product: { id: 4, name: 'Surface Phone' }
        });
    });

    it('should create a new state', function () {
        (0, _chai.expect)(newState).not.to.equal(state);
    });

    it('should add a item to new state', function () {
        (0, _chai.expect)(newState.products.length).to.equal(4);
    });

    it('should not change the original state', function () {
        (0, _chai.expect)(state.products.length).to.equal(3);
    });
});