# redux-logic-test - redux-logic test utilities

> "Simplifying testing with redux-logic"

Utilities:

 - `createMockStore` - create a redux-logic middleware and a redux store, attaching the middleware and providing a mechanism to verify the dispatched actions

[![Build Status](https://secure.travis-ci.org/jeffbski/redux-logic-test.png?branch=master)](http://travis-ci.org/jeffbski/redux-logic-test) [![Known Vulnerabilities](https://snyk.io/test/github/jeffbski/redux-logic-test/badge.svg)](https://snyk.io/test/github/jeffbski/redux-logic-test) [![NPM Version Badge](https://img.shields.io/npm/v/redux-logic-test.svg)](https://www.npmjs.com/package/redux-logic-test)

## Installation

redux-logic-test has peerDependencies of redux and redux-logic (which also needs rxjs)

```bash
npm install rxjs --save
npm install redux-logic --save
npm install redux --save
npm install redux-logic-test --save-dev
```

### ES6 module import

```js
import { createMockStore } from 'redux-logic-test';
```

### Commonjs

```js
const createMockStore = require('redux-logic-test').default.createMockStore;
```

### UMD/CDN use from script tags

The UMD build is mainly used for using in online playgrounds like jsfiddle.

```html
<script src="https://npmcdn.com/redux@%5E3.6.0/dist/redux.min.js"></script>
<script src="https://unpkg.com/redux-logic@%5E0.11.6/dist/redux-logic.min.js"></script>
<script src="https://unpkg.com/redux-logic-test@%5E1.0.1/dist/redux-logic-test.min.js"></script>
<script type="text/javascript">
  const { createLogic } = ReduxLogic;
  const { createMockStore } = ReduxLogicTest;
  // ready to use createMockStore
</script>
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

## Quick example

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

## Examples

### Live examples

 - [basic usage](https://jsfiddle.net/jeffbski/w3k5t83x/) - simple use or createMockStore to test actions that were dispatched (jsfiddle)
 - [async search](https://jsfiddle.net/jeffbski/a2cd2h96/) - async search using createMockStore to setup a test store (jsfiddle)

### Full examples

 - [browser-basic](/blob/master/examples/browser-basic/src/App.test.js) - basic example of using createMockStore to test logic
 - [nodejs-basic](/blob/master/examples/nodejs-basic/index.js) - simple Node.js example using createMockStore via Commonjs to test logic


## Get involved

If you have input or ideas or would like to get involved, you may:

 - contact me via twitter @jeffbski  - <http://twitter.com/jeffbski>
 - open an issue on github to begin a discussion - <https://github.com/jeffbski/redux-logic-test/issues>
 - fork the repo and send a pull request (ideally with tests) - <https://github.com/jeffbski/redux-logic-test>

## Supporters

This project is supported by [CodeWinds Training](https://codewinds.com/)


<a name="license"/>

## License - MIT

 - [MIT license](http://github.com/jeffbski/redux-logic-test/raw/master/LICENSE.md)
