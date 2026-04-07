import {TERMS_CONDITIONS_WATCHER, TERMS_CONDITIONS_SUCCESS, TERMS_CONDITIONS_FAILURE} from '../../constant';

export function userTermsWatcher(payload, resolve, reject) {
  console.log('actionWatcher........');
  return {type: TERMS_CONDITIONS_WATCHER, payload, resolve, reject};
}

export function userTermsSuccess(payload) {
  return {type: TERMS_CONDITIONS_SUCCESS, payload: payload};
}

export function userTermsError(error) {
  return {type: TERMS_CONDITIONS_FAILURE, payload: error};
}
