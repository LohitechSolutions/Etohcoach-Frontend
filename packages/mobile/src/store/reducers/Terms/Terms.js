import {TERMS_CONDITIONS_WATCHER, TERMS_CONDITIONS_SUCCESS, TERMS_CONDITIONS_FAILURE} from '../../constant';

const initialState = {
    termsConditionData: [],
  error:null,
};

export default function TermsReducer(state = initialState, action) {
  switch (action.type) {
    case TERMS_CONDITIONS_WATCHER:
      console.log('reducedwatcher', state.termsConditionData);
      return {
        ...state,
        error: null,
        termsConditionData: action.payload,
      };
    case TERMS_CONDITIONS_SUCCESS:
      return {
        ...state,
        error: null,
        termsConditionData: action.payload,
      };
    case TERMS_CONDITIONS_FAILURE:
      return {
        ...state,
        error: action,
      };
    default:
      return state;
  }
}
