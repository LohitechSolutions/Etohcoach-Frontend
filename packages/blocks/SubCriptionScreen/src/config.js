Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  // Customizable Area Start
  exports.subscriptionUrl = 'user/subscription';
  exports.subscriptionApiMethodType = "POST";
  exports.subscriptionContentType = "application/json";
  exports.subscriptionApiData= {
    "subscription_id": "null",
    "subscription_date": "null",
    "duration": "null"
  };
  //Subscription Cancellation
exports.subscriptionCancelUrl = 'cancel/user/subscription';
exports.subscriptionCancelApiMethodType = "GET";


  //Pricing list API
  exports.pricingListUrl = 'subscriptions/list';
  exports.pricingListApiMethodType = "GET";
  exports.pricingListContentType = "application/json";
  
  // Customizable Area End