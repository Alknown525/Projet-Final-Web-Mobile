const initialState = {
  publications: [],
  loading: false,
};

export const CHARGER_PUBLICATIONS = 'CHARGER_PUBLICATIONS'

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
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

