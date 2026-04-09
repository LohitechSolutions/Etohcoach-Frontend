/**
 * Migration shim: no real persistence. Keeps persistCombineReducers + persistStore API
 * so existing store setup runs without the native dependency tree.
 */

export function persistCombineReducers(config, reducers) {
  const keys = Object.keys(reducers);
  return function root(state = {}, action) {
    let next = {};
    let changed = false;
    for (const key of keys) {
      const prev = state[key];
      const slice = reducers[key](prev, action);
      next[key] = slice;
      changed = changed || slice !== prev;
    }
    return changed ? next : state;
  };
}

export function persistStore(store, options, callback) {
  const persistor = {
    purge() {
      return Promise.resolve();
    },
    flush() {
      return Promise.resolve();
    },
    pause() {},
    persist() {},
    subscribe() {
      return () => {};
    }
  };
  if (typeof callback === "function") {
    setTimeout(callback, 0);
  }
  return persistor;
}
