export const initialState = {
  publications: [],
  loading: false,
  newPostAvailable: false,
};

export const CHARGER_PUBLICATIONS = 'CHARGER_PUBLICATIONS'
export const SET_NEW_POST_AVAILABLE = 'SET_NEW_POST_AVAILABLE'

const dataReducer = (state, action) => {
  switch (action.type) {
    case SET_NEW_POST_AVAILABLE:
      return { ...state, newPostAvailable: action.payload };
    case CHARGER_PUBLICATIONS:
      return {
        ...state,
        publications: action.payload,
        loading: false,
      }
    default:
      return state
  }
}

export default dataReducer

