import createStateProxy from './state-proxy';

const reducerStateProxy = (reducer) => {
    return (state, action) => {
        if (action.type.substr(0, 2) === '@@') {
            return reducer(state, action);
        } 
        const stateProxy = createStateProxy(state);
        reducer(stateProxy, action);
        return stateProxy.getNewState();
    }
};

export default reducerStateProxy;
