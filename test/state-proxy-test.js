import { expect } from 'chai';
import createStateProxy from '../src/state-proxy';
import utils from '../src/utils'; 

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
                id: 2,// active role
                name: 'Manager' 
            }
        },
    };
})

describe('when no one modification was made', function() {
    it('should not create a new state', function() {
        const stateProxy = createStateProxy(state);
        const newState = stateProxy.__newState;
        expect(newState).to.equal(state);
    });
});

describe('when some modification was made', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        stateProxy.user.name = 'George';
        newState = stateProxy.__newState;
    });

    it('should create a new state', function() {
        expect(newState).to.not.equal(state);
    });

    it('should affect changed objects', function() {
        expect(newState.user).to.not.equal(state.user);
    });

    it('should not affect unchanged objects', function() {
        expect(newState.products).to.equal(state.products);
        expect(newState.tree).to.equal(state.tree);
    });
});

describe('when add an item in an array', function() {
    it('should increase the length of array', function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products.push({
            id: 4,
            name: 'Other',
        });
        const newState = stateProxy.__newState;
        expect(newState.products.length).to.equal(4);
    });
});    

describe('when change a property in a nested object', function() {
    it('should create a new state to all properties', function() {
        const stateProxy = createStateProxy(state);
        stateProxy.user.roleActive.name = 'New name';
        const newState = stateProxy.__newState;
        expect(newState).to.not.equal(state);
        expect(newState.user).to.not.equal(state.user);
        expect(newState.user.roleActive).to.not.equal(state.user.roleActive);
    });
});

describe('when change item in an array', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products[0].name = 'Microsoft';
        newState = stateProxy.__newState;
    });

    it('should change the state', function() {        
        expect(newState).to.not.equal(state);
    });

    it('should change the array', function() {        
        expect(newState.products).to.not.equal(state.products);
    });

    it('should change the array item', function() {        
        expect(newState.products[0]).to.not.equal(state.products[0]);
    });
});

describe('when remove item in an array', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products.splice(1, 1);
        newState = stateProxy.__newState;
    });

    it('should change the state', function() {        
        expect(newState).to.not.equal(state);
    });

    it('should change the array', function() {        
        expect(newState.products).to.not.equal(state.products);
    });

    it('should change the length of the array', function() {        
        expect(newState.products.length).to.equal(2);
    });
});

describe('when set a proxy in a property', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        const roleProxy = stateProxy.user.roles[0];
        stateProxy.roleActive = roleProxy;
        newState = stateProxy.__newState;//getNewState
    });

    it('should set the original data and not the proxy', function() {        
        expect(newState.roleActive).to.equal(state.user.roles[0]);
    });
});
