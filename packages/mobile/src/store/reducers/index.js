import {combineReducers} from 'redux';

import login from './Login';
import Terms from './Terms/Terms';
import offlineReducer from './OfflineData/OfflineData';
import subscriptionReducer from './Subscription';
import notificationReducer from './Notification';
import userProfileReducer from './UserProfile';
import legalReducer from './Legal';

const rootReducer = combineReducers({
  login,Terms,offlineReducer,subscriptionReducer,notificationReducer,userProfileReducer,legalReducer
});

export default rootReducer;
