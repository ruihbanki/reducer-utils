## Synopsis

Utilities to create a new state in redux.

## Code Example

// state

const state = {
    element: {
        {
            type: 'DIV'
        }
    }
};

// create a proxy state

const proxyState = createProxyState(state);
const proxy = proxyState.getProxy();

// change anything in proxy not change the original state

proxy.element.type = 'SPAN';

// get the new state

const newState = proxyState.getNewState();

## Motivation

It is common to make some mistakes when we are creating immutable states. 
Sometime it is necessary to write many code to create then.

## Installation

`npm install @ruihbanki/redux-state-utils`

## API Reference

### state-proxy

import createProxyState from '../src/state-proxy';

const proxyState = createProxyState(state);

// get proxy of the state

const proxy = proxyState.proxy;                 

// return the new state 

const newState = proxyState.getNewState();      

### utils

findByProperty(items, propName, propValue);

findById(items, id);

findNestedByProperty(items, propName, propValue, propChildren = 'children');

findNestedById(items, id, propChildren = 'children');

deleteByProperty(items, propName, propValue);

deleteById(items, id);

deleteNestedByProperty(items, propName, propValue, propChildren = 'children');

deleteNestedById(items, id, propChildren = 'children');

logDifferences(state, newState);

## Tests

`npm test`

## License

MIT
