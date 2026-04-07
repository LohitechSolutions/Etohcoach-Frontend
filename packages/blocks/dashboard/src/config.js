Object.defineProperty(exports, "__esModule", {
  value: true
});

// Customizable Area Start
exports.leaderBoardUrl = 'bx_block_profile/leader_boards';
exports.dashboardGetUrl = "dashboard";
exports.notificationApiMethodType = "GET";
exports.notificationContentType = "application/json";
exports.notificationGetUrl = "push_notifications/push_notifications";
exports.dashboarContentType = "application/json";
exports.dashboarApiMethodType = "GET";
exports.courseStartApiMethodType = "POST";
exports.courseStartApiEndPoint = "start/course";
exports.userInfoEndPoints = 'account_block/accounts/'

//Subscription Cancellation
exports.subscriptionCancelUrl = 'cancel/user/subscription';
exports.subscriptionCancelApiMethodType = "GET";

exports.subscriptionUrl = 'user/subscription';
exports.subscriptionApiMethodType = "POST";
exports.subscriptionContentType = "application/json";
exports.subscriptionApiData= {
  "subscription_id": "null",
  "subscription_date": "null",
  "duration": "null"
};
exports.onlineSyncUrl = '/online/data';
exports.onlineSyncMethodType="POST";
exports.onlineSyncContentType = "application/json";

exports.offlineGetUrl = "offline/data";
exports.offlineApiMethodType = "GET";
exports.offlineContentType = "application/json";

// Customizable Area End