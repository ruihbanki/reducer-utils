function logDifferences(state, newState, level = 1) {
    if (level === 1) {
        console.log('STATE DIFFERENCE');
    }    
    for (key in state) {
        const stateValue = state[key];
        if (stateValue instanceof Object) {
            const newStateValue = newState[key];
            if (stateValue !== newStateValue) {                
                console.log(Array(level + 1).join('-') + ' ' +  key);
                logDifferences(stateValue, newStateValue, level + 2);
            }
        }
    }
}