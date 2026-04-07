import {PRIVACY_POLICY_SUCCESS, PRIVACY_POLICY_FAILURE, PRIVACY_POLICY_WATCHER} from '../../constant';

const initialState = {
  privacyPolicyData: [],
  error:null,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case PRIVACY_POLICY_WATCHER:
      console.log('reducedwatcher', state.privacyPolicyData);
      return {
        ...state,
        error: null,
        privacyPolicyData: action.payload,
      };
    case PRIVACY_POLICY_SUCCESS:
      return {
        ...state,
        error: null,
        privacyPolicyData: action.payload,
      };
    case PRIVACY_POLICY_FAILURE:
      return {
        ...state,
        error: action,
      };
    default:
      return state;
  }
}
