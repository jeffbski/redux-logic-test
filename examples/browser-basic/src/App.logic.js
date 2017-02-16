import { createLogic } from 'redux-logic';

export const fooLogic = createLogic({
  type: 'FOO',
  process({ API, getState, action }, dispatch, done) {
    API.get()
       .then(results => {
         dispatch({ type: 'FOO_SUCCESS', payload: results });
         done();
       });
  }
});

export default [
  fooLogic
];
