# **React Native** | _**EtOHCoachFinal**_ | _**159129**_ | _**studio_pro**_

## **Catalog ProjectId: 112687** | **Catalog BuildId: 4996**

## NOTE FOR DEVELOPERS:
Clone the code-engine branch into your working branch. The contents of the branch may get overwritten.
## Author:..
Code-Engine
## Keywords:
 - EtOHCoachFinal
 - mobile
## Assembled Features To Block Status

| **Feature-Name**        | **Block-Name**        | **Path**  | **Status**  |
|:-------------|:-------------|:-------------|:-------------|
| Search2      | search<br>core<br>      | {+packages/blocks/search+}<br>{+packages/blocks/core+}<br> | {+Non-Empty+} |
| SignuploginModule2      | social-media-account-registration<br>social-media-account<br>email-account-login<br>email-account-registration<br>country-code-selector<br>forgot-password<br>otp-input-confirmation<br>social-media-account-login<br>      | {+packages/blocks/social-media-account-registration+}<br>{+packages/blocks/social-media-account+}<br>{+packages/blocks/email-account-login+}<br>{+packages/blocks/email-account-registration+}<br>{+packages/blocks/country-code-selector+}<br>{+packages/blocks/forgot-password+}<br>{+packages/blocks/otp-input-confirmation+}<br>{+packages/blocks/social-media-account-login+}<br> | {+Non-Empty+} |
| PushNotifications      | pushnotifications<br>      | {+packages/blocks/pushnotifications+}<br> | {+Non-Empty+} |
| Dashboard4      | dashboard<br>      | {+packages/blocks/dashboard+}<br> | {+Non-Empty+} |
| Catalogue      | catalogue<br>      | {+packages/blocks/catalogue+}<br> | {+Non-Empty+} |
| ContactUs2      | contactus<br>      | {+packages/blocks/contactus+}<br> | {+Non-Empty+} |
| Profilebio      | user-profile-basic<br>      | {+packages/blocks/user-profile-basic+}<br> | {+Non-Empty+} |
| SplashScreen2      | splashscreen<br>      | {+packages/blocks/splashscreen+}<br> | {+Non-Empty+} |
| Sorting6      | sorting<br>      | {+packages/blocks/sorting+}<br> | {+Non-Empty+} |
| FilterItems      | filteritems<br>      | {+packages/blocks/filteritems+}<br> | {+Non-Empty+} |
| CategoriessubCategories      | categoriessubcategories<br>      | {+packages/blocks/categoriessubcategories+}<br> | {+Non-Empty+} |
| Notifications3      | notifications<br>      | {+packages/blocks/notifications+}<br> | {+Non-Empty+} |
| Analytics9      | analytics<br>      | {+packages/blocks/analytics+}<br> | {+Non-Empty+} |
| Subscriptions2      | customisableusersubscriptions<br>      | {+packages/blocks/customisableusersubscriptions+}<br> | {+Non-Empty+} |
| BulkUploading      | BulkUploading      | {-packages/blocks/BulkUploading-} | {-Empty-} |
| Scoring      | Scoring      | {-packages/blocks/Scoring-} | {-Empty-} |
| QuestionBank      | QuestionBank      | {-packages/blocks/QuestionBank-} | {-Empty-} |
| LanguageOptions      | LanguageOptions      | {-packages/blocks/LanguageOptions-} | {-Empty-} |
| Library2      | Library2      | {-packages/blocks/Library2-} | {-Empty-} |
| AdminConsole3      | AdminConsole3      | {-packages/blocks/AdminConsole3-} | {-Empty-} |
| DataImportexportcsv      | DataImportexportcsv      | {-packages/blocks/DataImportexportcsv-} | {-Empty-} |
| Leaderboard      | Leaderboard      | {-packages/blocks/Leaderboard-} | {-Empty-} |
| Notes      | Notes      | {-packages/blocks/Notes-} | {-Empty-} |
| EmailNotifications      | EmailNotifications      | {-packages/blocks/EmailNotifications-} | {-Empty-} |
| Polling      | Polling      | {-packages/blocks/Polling-} | {-Empty-} |
| Gamification      | Gamification      | {-packages/blocks/Gamification-} | {-Empty-} |
| StripeIntegration      | StripeIntegration      | {-packages/blocks/StripeIntegration-} | {-Empty-} |
| SubscriptionBilling      | SubscriptionBilling      | {-packages/blocks/SubscriptionBilling-} | {-Empty-} |
| Annotations      | Annotations      | {-packages/blocks/Annotations-} | {-Empty-} |
| AssessmentTest      | AssessmentTest      | {-packages/blocks/AssessmentTest-} | {-Empty-} |
| TermsAndConditions      | TermsAndConditions      | {-packages/blocks/TermsAndConditions-} | {-Empty-} |
| ContentManagement      | ContentManagement      | {-packages/blocks/ContentManagement-} | {-Empty-} |
| PaymentAdmin2      | PaymentAdmin2      | {-packages/blocks/PaymentAdmin2-} | {-Empty-} |
| Settings5      | Settings5      | {-packages/blocks/Settings5-} | {-Empty-} |
| CfAppleLogin17      | CfAppleLogin17      | {-packages/blocks/CfAppleLogin17-} | {-Empty-} |
| CfFlashcards2      | CfFlashcards2      | {-packages/blocks/CfFlashcards2-} | {-Empty-} |

## AWS BACKEND DEPLOYMENT URL
 - BaseURL exported as: "https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe"
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

See docs folder for additional information.

### Prerequisites

What things you need to install the software and how to install them

* React Native (last tested on react-native0.61.3)
  - https://facebook.github.io/react-native/docs/getting-started

* IFF brew is installed and user doesn't have permisions.
```
  $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
  $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

* XCode 11 or greater

* XCode Command Line Tools
```
  $ xcode-select --install
```

* Android SDK
```
  $ brew cask install android-sdk
```

* JDK 11
```
  $ brew tap homebrew/cask-versions
  $ brew cask install java
  $ brew cask install java11
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install yarn
```
  $ brew install yarn
```

Install node

```
  $ brew install node
```

Web
```
  $ yarn
  $ yarn workspace web start 
  (Note: After udpating depencies run again if no cocde erros. )
```

iOS
```
  $ yarn
  $ cd packages/mobile/ios && pod install && cd ../../../ && cp node-runners/RCTUIImageViewAnimated.m node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m && npx react-native bundle --entry-file ./packages/mobile/index.js --platform ios --dev true --bundle-output ./packages/mobile/ios/main.jsbundle && yarn ios
```

Android - https://docs.expo.io/versions/latest/workflow/android-studio-emulator/
```
  $ yarn
  $ export JAVA_HOME=`/usr/libexec/java_home -v 11`; java -version; export ANDROID_HOME=${HOME}/Library/Android/sdk; export PATH=${PATH}:${ANDROID_HOME}/emulator && yarn android
```

## Running the tests

```
  $ yarn test
```


## CI/CD Details

We use GitlabCI for our deployment/Build pipelines

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).



