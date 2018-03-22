import createStateProxy from './state-proxy';

export const reducerStateProxy = (state, action) => {
    return reducer => {
        const stateProxy = createStateProxy(state);
        const stateResult = reducer(stateProxy, reducer);
        return stateResult.getNewState();
    };
};

export default reducerStateProxy;
