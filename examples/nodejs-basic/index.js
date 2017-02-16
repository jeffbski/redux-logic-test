const expect = require('expect');
const { createMockStore } = require('redux-logic-test').default;
const { createLogic } = require('redux-logic').default;

const fooLogic = createLogic({
  type: 'FOO',
  process({ API, getState, action }, dispatch, done) {
    API.get()
       .then(results => {
         dispatch({ type: 'FOO_SUCCESS', payload: results });
         done();
       });
  }
});

const api = {
  get() { return Promise.resolve(42); }
};

const logic = [fooLogic]; // array of logic to use/test
const injectedDeps = { // include what is needed for logic
  API: api // could include mocked API for easy testing
};

const initialState = {}; // optionally set
const reducer = (state /* ,action */) => { return state; }; // optional

const store = createMockStore({
  initialState,
  reducer,
  logic,
  injectedDeps
});

store.dispatch({ type: 'FOO' }); // kick off fetching
store.dispatch({ type: 'BAR' }); // other dispatches
store.whenComplete(() => { // runs this fn when all logic is complete
  console.log('actions', store.actions);
  expect(store.actions).toEqual([
    { type: 'FOO' },
    { type: 'BAR' },
    { type: 'FOO_SUCCESS', payload: 42 }
  ]);
});
