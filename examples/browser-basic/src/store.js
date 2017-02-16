import { createStore, applyMiddleware } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import appLogic from './App.logic';
import appReducer from './App.reducer';

export default function configureStore() {
  const logic = [
    ...appLogic
  ];

  const injectedDeps = {
    API: { //simulate an async fetch
      get() { return Promise.resolve(42); }
    }
  };

  const logicMiddleware = createLogicMiddleware(logic, injectedDeps);
  const enhancer = applyMiddleware(logicMiddleware);
  const store = createStore(appReducer, enhancer);
  store.logicMiddleware = logicMiddleware;
  return store;
}
