/* Minimal Redux subset for bundling / migration (redux@4-compatible API surface). */

function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return function combination(state = {}, action) {
    let nextState = {};
    let hasChanged = false;
    for (const key of keys) {
      const reducer = reducers[key];
      const prev = state[key];
      const next = reducer(prev, action);
      nextState[key] = next;
      hasChanged = hasChanged || next !== prev;
    }
    return hasChanged ? nextState : state;
  };
}

export function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === "function" && enhancer === undefined) {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (enhancer !== undefined) {
    if (typeof enhancer !== "function") {
      throw new Error("Expected enhancer to be a function.");
    }
    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentReducer = reducer;
  let currentState =
    preloadedState === undefined
      ? currentReducer(undefined, { type: "@@redux/INIT" })
      : preloadedState;
  let listeners = [];
  let isDispatching = false;

  function getState() {
    if (isDispatching) {
      throw new Error("You may not call getState while the reducer is executing.");
    }
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("Expected listener to be a function.");
    }
    listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function dispatch(action) {
    if (!action || typeof action.type === "undefined") {
      throw new Error('Actions must be plain objects with a type property.');
    }
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    listeners.forEach((l) => l());
    return action;
  }

  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error("Expected nextReducer to be a function.");
    }
    currentReducer = nextReducer;
    dispatch({ type: "@@redux/REPLACE" });
  }

  dispatch({ type: "@@redux/INIT" });

  return { getState, dispatch, subscribe, replaceReducer };
}

export function applyMiddleware(...middlewares) {
  return (createStoreImpl) => (reducer, preloadedState) => {
    const store = createStoreImpl(reducer, preloadedState);
    let dispatch = () => {
      throw new Error("Dispatch not ready");
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    const chain = middlewares.map((m) => m(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    return { ...store, dispatch };
  };
}

export function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return (...args) => dispatch(actionCreators(...args));
  }
  if (actionCreators === null || typeof actionCreators !== "object") {
    throw new Error("bindActionCreators expected an object or a function.");
  }
  const bound = {};
  for (const key of Object.keys(actionCreators)) {
    const ac = actionCreators[key];
    if (typeof ac === "function") {
      bound[key] = (...args) => dispatch(ac(...args));
    }
  }
  return bound;
}
