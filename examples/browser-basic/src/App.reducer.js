const initialState = {
  answer: null
};

export default function reducer(state=initialState, action={}) {
  if (action.type === 'FOO_SUCCESS') {
    return {
      ...state,
      answer: action.payload
    };
  }
  return state;
}
