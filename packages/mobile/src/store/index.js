import AsyncStorage from "@react-native-async-storage/async-storage";
import { applyMiddleware, createStore } from '../../../../react-native/src/shims/redux';
import { persistCombineReducers, persistStore } from '../../../../react-native/src/shims/redux-persist';
import thunk from '../../../../react-native/src/shims/redux-thunk';
import rootReducer from './reducers';
// export const sagaMiddleware = createSagaMiddleware();



export const configStore = () => {
  const persistConfig = {
    key : "root",
    storage : AsyncStorage,
    debug : true
  };

  const store = createStore(persistCombineReducers(persistConfig, {
    rootReducer
  }),applyMiddleware(thunk))
  const persistor = persistStore(store)
  return {store,persistor};
};
