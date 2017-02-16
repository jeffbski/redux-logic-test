import { createStore, applyMiddleware } from 'redux';
import { createLogicMiddleware } from 'redux-logic';

/*
  // specify as much as necessary for your particular test
  const store = createMockStore({
    initialState: optionalObject,
    reducer: optionalFn, // default: identity reducer
    logic: optionalLogic, // default: []
    injectedDeps: optionalObject, // default {}
    middleware: optionalArr // other mw, exclude logicMiddleware
  });
  store.dispatch(...) // use as necessary for your test
  // when all inflight logic has all completed calls fn + returns promise
  store.whenComplete(fn) - shorthand for store.logicMiddleware.whenComplete(fn)
  store.actions - the actions dispatched, use store.resetActions() to clear
  store.resetActions() - clear store.actions
  // access the logicMiddleware created for logic/injectedDeps props
  // use addLogic, mergeNewLogic, replaceLogic, whenComplete, monitor$
  store.logicMiddleware
 */


const defaultMockStoreOptions = {
  initialState: undefined,
  reducer(state /* , action */) { return state; }, // identity reducer
  logic: [], // used for the logicMiddleware that is created
  injectedDeps: {}, // used for the logicMiddleware that is created
  middleware: [] // other mw, exclude logicMiddleware from this array
};

const ALLOWED_OPTIONS = Object.keys(defaultMockStoreOptions);

function checkOptions(obj) {
  Object.keys(obj).forEach(k => { // check keys
    if (ALLOWED_OPTIONS.indexOf(k) === -1) { // no match
      throw new Error(`invalid option: ${k}`);
    }
  });
  if (obj.reducer && typeof obj.reducer !== 'function') {
    throw new Error('reducer should be a function');
  }
  if (obj.middleware && !Array.isArray(obj.middleware)) {
    throw new Error('middleware should be an array');
  }
}

export default function createMockStore(options = {}) {
  checkOptions(options); // throws if any problems
  const opts = {
    ...defaultMockStoreOptions,
    ...options
  };
  const { initialState, reducer, logic, injectedDeps, middleware } = opts;

  // track the actions dispatched using a custom mw added last
  const actions = [];
  const trackActionsMW = (/* store */) => next => action => {
    actions.push(action);
    return next(action);
  };

  const logicMiddleware = createLogicMiddleware(logic, injectedDeps);
  const enhancer = applyMiddleware(
    logicMiddleware,
    ...middleware,
    trackActionsMW
  );
  const store = createStore(reducer, initialState, enhancer);
  Object.defineProperty(store, 'actions', { // create store.actions getter
    enumerable: true,
    get() { return actions; }
  });
  store.resetActions = () => { actions.length = 0; }; // truncate
  store.logicMiddleware = logicMiddleware;
  store.whenComplete = (fn) => logicMiddleware.whenComplete(fn);
  return store;
}
