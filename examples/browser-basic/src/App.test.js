import { createMockStore } from 'redux-logic-test';
import appLogic from './App.logic';
import appReducer from './App.reducer';

// these can be customized/mocked for use in testing
const injectedDeps = {
  API: { //simulate an async fetch
    get() { return Promise.resolve(42); }
  }
};


describe('appLogic test without reducer', () => {

  describe('appLogic test without reducer', () => {
    let store;
    beforeEach(() => {
      store = createMockStore({
        logic: appLogic,
        injectedDeps
      });
    });

    it('should fetch answer and dispatch', done => {
      store.dispatch({ type: 'FOO' }); // start fetching
      store.whenComplete(() => { // all logic has completed
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'FOO_SUCCESS', payload: 42 }
        ]);
        done();
      });
    });
  });

  describe('appLogic test with reducer', () => {
    let store;
    beforeEach(() => {
      store = createMockStore({
        reducer: appReducer,
        logic: appLogic,
        injectedDeps
      });
    });

    it('should fetch answer and dispatch', done => {
      store.dispatch({ type: 'FOO' }); // start fetching
      store.whenComplete(() => { // all logic has completed
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'FOO_SUCCESS', payload: 42 }
        ]);
        done();
      });
    });
  });

});
