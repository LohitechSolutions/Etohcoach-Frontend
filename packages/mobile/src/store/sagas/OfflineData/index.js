import {takeLatest, put, call} from '../../../../../../react-native/src/shims/redux-saga-effects';

import {TERMS_CONDITIONS_WATCHER} from '../../constant';

import { userTermsError, userTermsSuccess} from '../../actions';
import {useState} from 'react';
import { baseURL } from '../../../../../framework/src/config';

function* onOfflineDownload(userLoginResendCodeAction) {
  console.log('saga789-------');
  let {payload, resolve, reject} = userLoginResendCodeAction;
  console.log('payload555', payload);
  try {
    const header = {'Content-Type': 'application/json'};
    const response = yield fetch(`${baseURL}terms_and_conditions`, {
      method: 'GET',
      headers: header,
      // body: payload,
    }).then(res => res.json());
    console.log('saga1');
    // .then(json => setitem(json.item));
    // setitem(json[5].avatar);
    yield put(userTermsSuccess(response));
    console.log('sagasuccess');
    resolve(response);
  } catch (e) {
    console.log('sagafailure');
    yield put(userTermsError(e));
    reject(e);
  }
}

export function* offlineDataWatcher() {
  yield takeLatest(ADD_OFFLINE_DATA, onOfflineDownload);
}
