import { all } from 'redux-saga/effects';

import { userLoginActionWatcher } from './Login';
import { userTermsActionWatcher } from './Terms/Terms';

export default function* root() {
  yield all([userLoginActionWatcher(), userTermsActionWatcher()]);
}
