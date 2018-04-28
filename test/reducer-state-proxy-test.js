import { expect } from 'chai';
import reducerStateProxy from '../src/reducer-state-proxy';

let state = null;
beforeEach(function() {
    state = {
        products: [
            {
                id: 1,
                name: 'Nokia',
            },
            {
                id: 2,
                name: 'Iphone',
            },
            {
                id: 3,
                name: 'Galaxy',
            },
        ],
        tree: [
            {
                id: 1,
                name: 'Item 1',
                children: [
                    {
                        id: 2,
                        name: 'Item 1.1',
                        children: [
                            {
                                id: 3,
                                name: 'Item 1.1.1',
                            }
                        ]
                    },
                    {
                        id: 4,
                        name: 'Item 1.2',
                    }                
                ]
            },
            {
                id: 5,
                name: 'Item 2',
            },
        ],
        user: {
            name: 'Jonh',
            roles: [
                {
                    id: 1,
                    name: 'Engineer'
                },
                {
                    id: 2,
                    name: 'Manager'
                },
            ],
            roleActive: {
                id: 2,
                name: 'Manager' 
            }
        },
    };
})

describe('when not change the state', function() {
    let newState = null;
    beforeEach(function() {
        const reducer = (state, action) => {
        };
        newState = reducerStateProxy(reducer)(state, {
            type: 'NOTHING', 
        });
    });  

    it('should not create a new state', function() {
        expect(newState).to.equal(state);
    });
});

describe('when add an item to an array', function() {
    let newState = null;
    beforeEach(function() {
        const reducer = (state, action) => {
            state.products.push(action.product)
        };
        newState = reducerStateProxy(reducer)(state, {
            type: 'ADD_PRODUCT', 
            product: {id: 4, name: 'Surface Phone'}
        });
    });  

    it('should create a new state', function() {
        expect(newState).not.to.equal(state);
    });

    it('should add a item to new state', function() {
        expect(newState.products.length).to.equal(4);
    });

    it('should not change the original state', function() {
        expect(state.products.length).to.equal(3);
    });
});