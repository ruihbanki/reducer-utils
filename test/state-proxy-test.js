import { expect } from 'chai';
import createProxyState from '../src/state-proxy';
import utils from '../src/utils'; 

describe('#proxy-state', function() {
    it('should not create a new state if no one modification was made in the proxy', function() {
        const state = {};
        const proxyState = createProxyState(state);
        const proxy = proxyState.getProxy();
        const newState = proxyState.getNewState();
        expect(newState).to.equal(state);
    });
});

describe('#proxy-state', function() {
    it('should create a new state if some modification was made in the proxy', function() {
        const state = {};
        const proxyState = createProxyState(state);
        const proxy = proxyState.getProxy();
        proxy.newProperty = true;
        const newState = proxyState.getNewState();
        expect(newState).to.not.equal(state);
    });
});

describe('#proxy-state', function() {
    it('should create a new property if some modification was made in the proxy', function() {
        const state = {
            property1: {},
            property2: {}
        };
        const proxyState = createProxyState(state);
        const proxy = proxyState.getProxy();
        proxy.property1 = {};
        const newState = proxyState.getNewState();
        expect(newState.property1).to.not.equal(state.property1);
    });
});

describe('#proxy-state', function() {
    it('should not create a new property if no one modification was made in the property', function() {
        const state = {
            property1: {},
            property2: {}
        };
        const proxyState = createProxyState(state);
        const proxy = proxyState.getProxy();
        proxy.property1 = {};
        const newState = proxyState.getNewState();
        expect(newState.property2).to.equal(state.property2);
    });
});

describe('#proxy-state', function() {
    it('should not modificate the state when is made modifications in the proxy', function() {
        const state = {
            property1: {},
            property2: {},
            propertyArray: [
                {
                    property3: 1
                }
            ]
        };
        const copyState = deepCopy(state); 
        const proxyState = createProxyState(state);
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
        expect(state).to.deep.equal(copyState);
    });
});

describe('#proxy-state', function() {
    it('should create a new property if the property of the proxy was changed', function() {
        const state = {
            property1: {},
            property2: {},
            propertyArray: [
                {
                    property3: 1
                }
            ]
        };
        const proxyState = createProxyState(state);
        const proxy = proxyState.getProxy();
        proxy.propertyArray[0].property3 = 2;
        const newState = proxyState.getNewState();
        expect(state.propertyArray).to.not.equal(newState.propertyArray);
    });
});

describe('#proxy-state', function() {
    it('should create a new property to each nested property when the proxy is changed', function() {
        const state = {
            property1: {
                property2: [
                    {
                        property3: {
                            property4: {
                                property5: true
                            }
                        }
                    }
                ]
            },
        };
        const proxyState = createProxyState(state);
        const proxy = proxyState.getProxy();
        proxy.property1.property2[0].property3.property4.property5 = false;
        const newState = proxyState.getNewState();
        expect(state.property1).to.not.equal(newState.property1);
        expect(state.property1.property2).to.not.equal(newState.property1.property2);
        expect(state.property1.property2[0]).to.not.equal(newState.property1.property2[0]);
        expect(state.property1.property2[0].property3).to.not.equal(newState.property1.property2[0].property3);
        expect(state.property1.property2[0].property3.property4).to.not.equal(newState.property1.property2[0].property3.property4);
    });
});

function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}