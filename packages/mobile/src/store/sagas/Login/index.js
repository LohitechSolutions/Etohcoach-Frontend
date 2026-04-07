import {takeLatest, put, call} from 'redux-saga/effects';

import {PRIVACY_POLICY_WATCHER} from '../../constant';

import {userLoginError, userLoginSuccess} from '../../actions';
import {useState} from 'react';
import { baseURL } from '../../../../../framework/src/config';

function* onUserLogin(userLoginResendCodeAction) {
  console.log('saga-------');
  let {payload, resolve, reject} = userLoginResendCodeAction;
  console.log('payload', payload);
  try {
    const header = {'Content-Type': 'application/json'};
    const response = yield fetch(`${baseURL}privacy_policy`, {
      method: 'GET',
      headers: header,
      // body: payload,
    }).then(res => res.json());
    console.log('saga1');
    // .then(json => setitem(json.item));
    // setitem(json[5].avatar);
    yield put(userLoginSuccess(response));
    console.log('sagasuccess');
    resolve(response);
  } catch (e) {
    console.log('sagafailure');
    yield put(userLoginError(e));
    reject(e);
  }
}

export function* userLoginActionWatcher() {
  yield takeLatest(PRIVACY_POLICY_WATCHER, onUserLogin);
}
