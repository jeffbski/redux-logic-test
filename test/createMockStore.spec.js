import expect from 'expect';
import { createLogic } from 'redux-logic';
import { createMockStore } from '../src/index'; // redux-logic-test

describe('createMockStore', () => {

  describe('no params', () => {
    let store; // defined later
    beforeEach('create store', () => {
      store = createMockStore();
    });

    it('creates a store with the proper properties and methods', () => {
      expect(store).toExist();
      expect(store.getState).toBeA(Function);
      expect(store.dispatch).toBeA(Function);
      expect(store.subscribe).toBeA(Function);
      expect(store.whenComplete).toBeA(Function);
      expect(store.actions).toBeAn(Array);
      expect(store.resetActions).toBeA(Function);
      expect(store.logicMiddleware).toBeAn(Object);
    });

    it('tracks the actions dispatched', done => {
      store.dispatch({ type: 'FOO' });
      store.dispatch({ type: 'BAR' });
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'BAR' }
        ]);
        done();
      });
    });
  });

  describe('invalid options', () => {
    it('throws an error', () => {
      const fn = () => {
        createMockStore({ thisIsWrong: 42 });
      };
      expect(fn).toThrow('invalid option: thisIsWrong');
    });
  });

  describe('reducer not a function', () => {
    it('throws an error', () => {
      const fn = () => {
        createMockStore({ reducer: 1 }); // invalid should be fn
      };
      expect(fn).toThrow('reducer should be a function');
    });
  });

  describe('middleware not an array', () => {
    it('throws an error', () => {
      const fn = () => {
        createMockStore({ middleware: {} }); // invalid should be an array
      };
      expect(fn).toThrow('middleware should be an array');
    });
  });

  describe('w/initialState', () => {
    let store; // defined later
    beforeEach('create store', () => {
      store = createMockStore({ initialState: { a: 1 } });
    });

    it('should have the correct state', () => {
      expect(store.getState()).toEqual({ a: 1 });
    });
  });

  describe('w/reducer', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const initialState = {
        count: 0
      };
      const reducer = (state = initialState, action = {}) => {
        if (action.type === 'INCR') {
          return { count: state.count + 1 };
        }
        return state;
      };
      store = createMockStore({ reducer });
    });

    it('should adjust state', () => {
      expect(store.getState()).toEqual({ count: 0 });
      store.dispatch({ type: 'INCR' });
      store.dispatch({ type: 'INCR' });
      expect(store.getState()).toEqual({ count: 2 });
    });
  });

  describe('w/logic', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const fooLogic = createLogic({
        type: 'FOO',
        process() {
          return { type: 'FOO_SUCCESS' };
        }
      });
      const logic = [fooLogic];
      store = createMockStore({ logic });
    });

    it('should adjust state', done => {
      store.dispatch({ type: 'FOO' });
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'FOO_SUCCESS' }
        ]);
        done();
      });
    });

    it('should clear the actions when resetAction is called', done => {
      store.dispatch({ type: 'FOO' });
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'FOO_SUCCESS' }
        ]);
        store.resetActions();
        expect(store.actions).toEqual([]);
        done();
      });
    });
  });

  describe('w/injectedDeps', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const injectedDeps = { cat: 42 };
      store = createMockStore({ injectedDeps });
    });

    it('should provide deps to logic', done => {
      const fooLogic = createLogic({
        type: 'FOO',
        process({ cat }) {
          expect(cat).toBe(42);
          done();
        }
      });
      const logic = [fooLogic];
      store.logicMiddleware.mergeNewLogic(logic);
      store.dispatch({ type: 'FOO' });
    });
  });

  describe('w/middleware', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const barMW = (/* store */) => next => action => {
        if (typeof action === 'function') {
          return next(action());
        }
        return next(action);
      };
      const middleware = [barMW];
      store = createMockStore({ middleware });
    });

    it('actions should pass through mw', () => {
      store.dispatch(() => ({ type: 'DOG' }));
      expect(store.actions).toEqual([{ type: 'DOG' }]);
    });
  });

  describe('logic+injectedDeps', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const fooLogic = createLogic({
        type: 'FOO',
        process({ cat }) {
          expect(cat).toBe(42);
          return Promise.resolve({ type: 'FOO_SUCCESS' });
        }
      });
      const logic = [fooLogic];
      const injectedDeps = { cat: 42 };
      store = createMockStore({ logic, injectedDeps });
    });

    it('should dispatch', done => {
      store.dispatch({ type: 'FOO' });
      store.dispatch({ type: 'BAR' });
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'BAR' },
          { type: 'FOO_SUCCESS' }
        ]);
        done();
      });
    });
  });

  describe('logic+middleware', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const fooLogic = createLogic({
        type: 'FOO',
        process() {
          return Promise.resolve({ type: 'FOO_SUCCESS' });
        }
      });
      const logic = [fooLogic];
      const barMW = (/* store */) => next => action => {
        if (typeof action === 'function') {
          return next(action()); // execute action
        }
        return next(action);
      };
      const middleware = [barMW];
      store = createMockStore({ logic, middleware });
    });

    it('should dispatch', done => {
      store.dispatch({ type: 'FOO' });
      store.dispatch(() => ({ type: 'BAR' })); // fn
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'BAR' },
          { type: 'FOO_SUCCESS' }
        ]);
        done();
      });
    });
  });

  describe('kitchen sink', () => {
    let store; // defined later
    beforeEach('create store', () => {
      const reducer = (state, action) => {
        if (action.type === 'INCR') {
          return { ...state, count: state.count + 1 };
        }
        return state;
      };
      const fooLogic = createLogic({
        type: 'FOO',
        process({ getState, cat }) {
          expect(cat).toBe(42);
          return Promise.resolve({
            type: 'FOO_SUCCESS',
            count: getState().count
          });
        }
      });
      const logic = [fooLogic];
      const injectedDeps = { cat: 42 };
      const barMW = (/* store */) => next => action => {
        if (typeof action === 'function') {
          return next(action());
        }
        return next(action);
      };
      const middleware = [barMW];
      store = createMockStore({
        initialState: { count: 10 },
        reducer,
        logic,
        injectedDeps,
        middleware
      });
    });

    it('should dispatch actions updating state', done => {
      expect(store.getState()).toEqual({ count: 10 });
      store.dispatch({ type: 'INCR' });
      store.dispatch({ type: 'INCR' });
      expect(store.getState()).toEqual({ count: 12 });
      expect(store.actions).toEqual([
        { type: 'INCR' },
        { type: 'INCR' }
      ]);
      store.resetActions();
      expect(store.actions).toEqual([]);
      store.dispatch(() => ({ type: 'BAR' })); // fn, exec in mw
      expect(store.actions).toEqual([{ type: 'BAR' }]);
      store.resetActions();
      store.dispatch({ type: 'FOO' });
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: 'FOO' },
          { type: 'FOO_SUCCESS', count: 12 }
        ]);
        done();
      });
    });
  });

});
