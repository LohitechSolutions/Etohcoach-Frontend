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

  /** RevenueCat public SDK keys (dashboard → Project → API keys). Prefer injecting via your build/env in production. */
  exports.revenueCatIosApiKey = 'appl_IWwyCqEhSUcYlfQymwrvuOZgGVB';
  /** Set when supporting Android: goog_… */
  exports.revenueCatAndroidApiKey = '';
  
  // Customizable Area End