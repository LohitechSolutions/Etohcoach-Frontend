#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNGoogleSignin.h"

#import <GoogleMaps/GoogleMaps.h>
#import <FirebaseMessaging/FirebaseMessaging.h>

#import "RNSplashScreen.h"
@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   
  [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
  
  // Initialize Firebase
  [FIRApp configure];
  
  // Firebase Messaging delegate setup
  [FIRMessaging messaging].delegate = self;
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"EtOHCoachFinal"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [GIDSignIn sharedInstance].clientID = @"YOUR_GOOGLE_SIGN_IN_CLIENT_ID";
  [GIDSignIn sharedInstance].delegate = self;
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
     didFinishLaunchingWithOptions:launchOptions];

  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }
  
  [RNSplashScreen show];
  
  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (void)signIn:(GIDSignIn *)signIn didSignInForUser:(GIDGoogleUser *)user withError:(NSError *)error {
  // Handle Google Sign-In completion
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"packages/mobile/index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

#pragma mark - Firebase Messaging Delegate Methods

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  // Forward the device token to Firebase Messaging
  [FIRMessaging messaging].APNSToken = deviceToken;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  // Handle the received remote notification
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  // Add your custom logic here
  
  // Call the completion handler when finished
  completionHandler(UIBackgroundFetchResultNewData);
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
  // Receive the FCM token
  // You can send this token to your server for further processing or store it locally
}

@end
