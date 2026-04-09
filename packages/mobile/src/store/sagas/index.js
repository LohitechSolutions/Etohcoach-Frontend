import { all } from '../../../../../react-native/src/shims/redux-saga-effects';

import { userLoginActionWatcher } from './Login';
import { userTermsActionWatcher } from './Terms/Terms';

export default function* root() {
  yield all([userLoginActionWatcher(), userTermsActionWatcher()]);
}
