# redux-logic-test - redux-logic test utilities

> "Simplifying testing with redux-logic"

Utilities:

 - `createMockStore` - create a redux-logic middleware and a redux store, attaching the middleware and providing a mechanism to verify the dispatched actions

[![Build Status](https://secure.travis-ci.org/jeffbski/redux-logic-test.png?branch=master)](http://travis-ci.org/jeffbski/redux-logic-test) [![Known Vulnerabilities](https://snyk.io/test/github/jeffbski/redux-logic-test/badge.svg)](https://snyk.io/test/github/jeffbski/redux-logic-test) [![NPM Version Badge](https://img.shields.io/npm/v/redux-logic-test.svg)](https://www.npmjs.com/package/redux-logic-test)

## Installation

```bash
npm install redux-logic --save
npm install redux-logic-test --saveDev
```

### ES6 module import

```js
import { createMockStore } from 'redux-logic-test';
```

### Commonjs

```js
const { createMockStore } = require('redux-logic-test').default;
```

## Usage

```js
  import { createMockStore } from 'redux-logic-test';

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
```

## Goals

 - simplify the creation of a testing redux store with logicMiddleware attached
 - add built-in middleware to track actions that are dispatched
 - make it easy to verify the actions that were dispatched

## Example

```js
import { createMockStore } from 'redux-logic-test';
import { createLogic } from 'redux-logic';

const fooLogic = createLogic({
  type: 'FOO',
  process({ API, getState, action }, dispatch, done) {
    API.get(...)
      .then(results => {
        dispatch({ type: 'FOO_SUCCESS', payload: results });
        done();
      });
  }
});

const logic = [fooLogic]; // array of logic to use/test
const injectedDeps = { // include what is needed for logic
  API: api // could include mocked API for easy testing
};

const initialState = {}; // optionally set
const reducer = (state, action) => { return state; }; // optional

const store = createMockStore({
  initialState,
  reducer,
  logic,
  injectedDeps
});

store.dispatch({ type: 'FOO' }); // kick off fetching
store.dispatch({ type: 'BAR' }); // other dispatches
store.whenComplete(() => { // runs this fn when all logic is complete
  expect(store.getState()).toEqual({...});
  expect(store.actions).toEqual([
    { type: 'FOO' },
    { type: 'BAR' },
    { type: 'FOO_SUCCESS', payload: [...] }
  ]);
  // if desired, can reset the actions for more tests
  // store.resetActions(); // clear for more tests

  // call done() for your test when finished
});
```

## Get involved

If you have input or ideas or would like to get involved, you may:

 - contact me via twitter @jeffbski  - <http://twitter.com/jeffbski>
 - open an issue on github to begin a discussion - <https://github.com/jeffbski/redux-logic-test/issues>
 - fork the repo and send a pull request (ideally with tests) - <https://github.com/jeffbski/redux-logic-test>
 - See the [contributing guide](http://github.com/jeffbski/redux-logic-test/raw/master/CONTRIBUTING.md)

## Supporters

This project is supported by [CodeWinds Training](https://codewinds.com/)


<a name="license"/>

## License - MIT

 - [MIT license](http://github.com/jeffbski/redux-logic-test/raw/master/LICENSE.md)
