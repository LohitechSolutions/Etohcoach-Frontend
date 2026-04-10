import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../features/auth/LoginScreen";
import { ForgotPasswordOtpScreen } from "../features/auth/ForgotPasswordOtpScreen";
import { ForgotPasswordScreen } from "../features/auth/ForgotPasswordScreen";
import { NewPasswordScreen } from "../features/auth/NewPasswordScreen";
import { PasswordChangedScreen } from "../features/auth/PasswordChangedScreen";
import { RegisterScreen } from "../features/auth/RegisterScreen";
import { CatalogueScreen } from "../features/catalogue/CatalogueScreen";
import { OverViewScreen } from "../features/catalogue/OverViewScreen";
import { PlaceholderScreen } from "../features/common/PlaceholderScreen";
import { DashboardScreen } from "../features/dashboard/DashboardScreen";
import { TermsScreen } from "../features/legal/TermsScreen";
import { LeaderboardScreen } from "../features/leaderboard/LeaderboardScreen";
import { ChangeEmailScreen } from "../features/profile/ChangeEmailScreen";
import { ChangePasswordScreen } from "../features/profile/ChangePasswordScreen";
import { EditProfileScreen } from "../features/profile/EditProfileScreen";
import { ManageNotificationsScreen } from "../features/profile/ManageNotificationsScreen";
import { NotificationsScreen } from "../features/notifications/NotificationsScreen";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { FilterItemsScreen } from "../features/search/FilterItemsScreen";
import { FilterOptionsScreen } from "../features/search/FilterOptionsScreen";
import { SearchScreen } from "../features/search/SearchScreen";
import { SortingScreen } from "../features/search/SortingScreen";
import { SettingsScreen } from "../features/settings/SettingsScreen";
import { AddContactUsScreen } from "../features/support/AddContactUsScreen";
import { ContactUsScreen } from "../features/support/ContactUsScreen";
import { SplashScreen } from "../features/splash/SplashScreen";
import { CustomisableUserSubscriptionsScreen } from "../features/subscription/CustomisableUserSubscriptionsScreen";
import { PaymentAdmin2Screen } from "../features/subscription/PaymentAdmin2Screen";
import { StripeIntegrationScreen } from "../features/subscription/StripeIntegrationScreen";
import { SubscriptionBillingScreen } from "../features/subscription/SubscriptionBillingScreen";
import { SubscriptionDetailsScreen } from "../features/subscription/SubscriptionDetailsScreen";
import { SubscriptionPlansScreen } from "../features/subscription/SubscriptionPlansScreen";
import { SubscriptionSuccessScreen } from "../features/subscription/SubscriptionSuccessScreen";
import { advancedRoutes, coreRoutes } from "./routes";

type RootParamList = {
  Splashscreen: undefined;
  SPLASH: undefined;
  Landing: undefined;
  DashboardTabs: undefined;
} & Record<string, undefined>;

const RootStack = createNativeStackNavigator<RootParamList>();
const Tab = createBottomTabNavigator();

function TabIcon({ focused, icon }: { focused: boolean; icon: string }) {
  return (
    <Text
      style={{
        fontSize: 18,
        opacity: focused ? 1 : 0.55
      }}
    >
      {icon}
    </Text>
  );
}

function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: { height: 66, paddingBottom: 8, paddingTop: 8 }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" /> }}
      />
      <Tab.Screen
        name="Catalogue"
        component={CatalogueScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📚" /> }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏆" /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" />
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const routedScreens = new Set([
    "EmailAccountLoginBlock",
    "EmailAccountRegistration",
    "ForgotPassword",
    "ForgotPasswordOTP",
    "NewPassword",
    "PasswordChanged",
    "OverView",
    "Notifications",
    "Settings5",
    "TermsAndConditions",
    "Contactus",
    "AddContactus",
    "Search",
    "Sorting",
    "Filteritems",
    "Filteroptions",
    "SubCriptionScreen",
    "SubcriptionSuccsess",
    "Customisableusersubscriptions",
    "SubscriptionDetails",
    "SubscriptionBilling",
    "StripeIntegration",
    "PaymentAdmin2",
    "EditProfile",
    "ChangePassword",
    "ChangeEmail",
    "ManageNotifications"
  ]);

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Splashscreen">
        <RootStack.Screen name="Splashscreen" component={SplashScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="SPLASH" component={SplashScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Landing" component={LoginScreen} options={{ title: "Login" }} />
        <RootStack.Screen name="EmailAccountLoginBlock" component={LoginScreen} options={{ title: "Login" }} />
        <RootStack.Screen name="EmailAccountRegistration" component={RegisterScreen} />
        <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <RootStack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOtpScreen} />
        <RootStack.Screen name="NewPassword" component={NewPasswordScreen} />
        <RootStack.Screen name="PasswordChanged" component={PasswordChangedScreen} />
        <RootStack.Screen name="OverView" component={OverViewScreen} />
        <RootStack.Screen name="Notifications" component={NotificationsScreen} />
        <RootStack.Screen name="Settings5" component={SettingsScreen} />
        <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        <RootStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <RootStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
        <RootStack.Screen name="ManageNotifications" component={ManageNotificationsScreen} />
        <RootStack.Screen name="TermsAndConditions" component={TermsScreen} />
        <RootStack.Screen name="Contactus" component={ContactUsScreen} />
        <RootStack.Screen name="AddContactus" component={AddContactUsScreen} />
        <RootStack.Screen name="Search" component={SearchScreen} />
        <RootStack.Screen name="Sorting" component={SortingScreen} />
        <RootStack.Screen name="Filteritems" component={FilterItemsScreen} />
        <RootStack.Screen name="Filteroptions" component={FilterOptionsScreen} />
        <RootStack.Screen name="SubCriptionScreen" component={SubscriptionPlansScreen} />
        <RootStack.Screen name="SubcriptionSuccsess" component={SubscriptionSuccessScreen} />
        <RootStack.Screen name="Customisableusersubscriptions" component={CustomisableUserSubscriptionsScreen} />
        <RootStack.Screen name="SubscriptionDetails" component={SubscriptionDetailsScreen} />
        <RootStack.Screen name="SubscriptionBilling" component={SubscriptionBillingScreen} />
        <RootStack.Screen name="StripeIntegration" component={StripeIntegrationScreen} />
        <RootStack.Screen name="PaymentAdmin2" component={PaymentAdmin2Screen} />
        <RootStack.Screen name="DashboardTabs" component={DashboardTabs} options={{ headerShown: false }} />
        <RootStack.Screen name="UserProfileBasicBlock" component={ProfileScreen} />
        {[...coreRoutes, ...advancedRoutes]
          .filter((routeName) => !routedScreens.has(routeName))
          .map((routeName) => (
            <RootStack.Screen key={routeName} name={routeName} component={PlaceholderScreen} />
          ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
