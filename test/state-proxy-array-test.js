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
                id: 2,
                name: 'Manager' 
            }
        },
    };
})

describe('when add an item in an array', function() {
    it('should increase the length of array', function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products.push({
            id: 4,
            name: 'Other',
        });
        const newState = stateProxy.getNewState();
        expect(newState.products.length).to.equal(4);
    });
});    

describe('when change item in an array', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products[0].name = 'Microsoft';
        newState = stateProxy.getNewState();
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
        newState = stateProxy.getNewState();
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

describe('when concat an array', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products = stateProxy.products.concat([
            {
                id: 4,
                name: 'Other 1',
            },
            {
                id: 5,
                name: 'Other 2',
            },
        ]);
        newState = stateProxy.getNewState();
    });

    it('should change the state', function() {        
        expect(newState).to.not.equal(state);
    });

    it('should change the array', function() {        
        expect(newState.products).to.not.equal(state.products);
    });

    it('should change the length of the array', function() {        
        expect(newState.products.length).to.equal(5);
    });

    it('the new state of the array needs to be a common object and not a proxy', function() {        
        expect(newState.products.__isProxy).to.equal(undefined);
    });
});

describe('when used the every', function() {
    let newState = null;
    let result = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        result = stateProxy.products.every(item => {
            return item.id != null;
        });
        newState = stateProxy.getNewState();
    });

    it('should work properly', function() {        
        expect(result).to.equal(true);
    });

    it('should remain the state', function() {        
        expect(newState).to.equal(state);
    });

    it('should not change the array', function() {        
        expect(state.products).to.equal(newState.products);
    });
});

describe('when used the fill', function() {
    let newState = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        stateProxy.products.fill({
            id: 4,
            name: 'New'
        });
        newState = stateProxy.getNewState();
    });

    it('should work properly', function() {        
        expect(newState.products[0].id).to.equal(4);
    });

    it('should change the state', function() {        
        expect(newState).to.not.equal(state);
    });

    it('should change the array', function() {        
        expect(state.products).to.not.equal(newState.products);
    });
});

describe('when used the filter', function() {
    let newState = null;
    let result = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        result = stateProxy.products.filter(item => {
            return item.id < 2;
        });
        newState = stateProxy.getNewState();
    });

    it('should work properly', function() {        
        expect(result.length).to.equal(1);
    });

    it('should remain the state', function() {        
        expect(newState).to.equal(state);
    });

    it('should not change the array', function() {        
        expect(state.products).to.equal(newState.products);
    });
});

describe('when used the find', function() {
    let newState = null;
    let result = null;
    beforeEach(function() {
        const stateProxy = createStateProxy(state);
        result = stateProxy.products.find(item => {
            return item.id === 3;
        });
        newState = stateProxy.getNewState();
    });

    it('should work properly', function() {        
        expect(result.name).to.equal('Galaxy');
    });

    it('should remain the state', function() {        
        expect(newState).to.equal(state);
    });

    it('should not change the array', function() {        
        expect(state.products).to.equal(newState.products);
    });
});
