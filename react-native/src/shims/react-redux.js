import React from "react";

const ReduxContext = React.createContext(null);

export function Provider({ store, children }) {
  return <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;
}

export function useStore() {
  const store = React.useContext(ReduxContext);
  if (!store) {
    throw new Error("Redux store not found. Wrap app with Provider.");
  }
  return store;
}

export function useDispatch() {
  return useStore().dispatch;
}

export function useSelector(selector) {
  const store = useStore();
  const selectorRef = React.useRef(selector);
  selectorRef.current = selector;

  const [selected, setSelected] = React.useState(() =>
    selectorRef.current(store.getState())
  );

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextValue = selectorRef.current(store.getState());
      setSelected((prev) => (Object.is(prev, nextValue) ? prev : nextValue));
    });
    return unsubscribe;
  }, [store]);

  return selected;
}

export function connect(mapStateToProps, mapDispatchToProps) {
  return function wrap(WrappedComponent) {
    function ConnectedComponent(props) {
      const store = useStore();
      const stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), props)
        : {};

      let dispatchProps = { dispatch: store.dispatch };
      if (typeof mapDispatchToProps === "function") {
        dispatchProps = mapDispatchToProps(store.dispatch, props);
      } else if (mapDispatchToProps && typeof mapDispatchToProps === "object") {
        dispatchProps = Object.keys(mapDispatchToProps).reduce((acc, key) => {
          const actionCreator = mapDispatchToProps[key];
          acc[key] = (...args) => store.dispatch(actionCreator(...args));
          return acc;
        }, {});
      }

      const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
      React.useEffect(() => store.subscribe(forceUpdate), [store]);

      return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
    }

    ConnectedComponent.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
    return ConnectedComponent;
  };
}
