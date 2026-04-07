import {PRIVACY_POLICY_SUCCESS, PRIVACY_POLICY_FAILURE, PRIVACY_POLICY_WATCHER} from '../../constant';

export function userLoginWatcher(payload, resolve, reject) {
  console.log('actionWatcher');
  return {type: PRIVACY_POLICY_WATCHER, payload, resolve, reject};
}

export function userLoginSuccess(payload) {
  return {type: PRIVACY_POLICY_SUCCESS, payload: payload};
}

export function userLoginError(error) {
  return {type: PRIVACY_POLICY_FAILURE, payload: error};
}
