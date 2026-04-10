import i18next from "i18next";
import React from "react";
import { Dimensions, Image, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Scale from "../../../packages/components/src/Scale";
import { FONTS } from "../../../packages/framework/src/Fonts";
import { LEGACY_BLOCK_REGISTRY } from "../migration/legacyBlockRegistry";
import { withLegacyNavigation } from "../migration/legacyNavigationCompat";

const Tab = createBottomTabNavigator();

/** Same as `hp` in packages/mobile/App.tsx (percentage of window height). */
const windowHeight = Dimensions.get("window").height;
function hp(percentage: number) {
  return (windowHeight * percentage) / 100;
}

/** Tab icons live under `react-native/assets/images/` (copied from `packages/mobile/assets/images/`). */
const TAB_ICONS = {
  dashboard: require("../../assets/images/dashboard.png"),
  catalogue: require("../../assets/images/catalogue.png"),
  leaderboard: require("../../assets/images/leaderBoard.png"),
  profile: require("../../assets/images/profile.png")
};

function LegacyTabBarIcon({
  source,
  sizeHp,
  focused
}: {
  source: number;
  sizeHp: number;
  focused: boolean;
}) {
  const d = hp(sizeHp);
  return (
    <Image
      source={source}
      style={{
        height: d,
        width: d,
        tintColor: focused ? "black" : "grey"
      }}
    />
  );
}

const WDashboard = withLegacyNavigation(LEGACY_BLOCK_REGISTRY.Dashboard);
const WCatalogue = withLegacyNavigation(LEGACY_BLOCK_REGISTRY.Catalogue);
const WLeaderboard = withLegacyNavigation(LEGACY_BLOCK_REGISTRY.Leaderboard);
const WProfile = withLegacyNavigation(LEGACY_BLOCK_REGISTRY.UserProfileBasicBlock);

/**
 * Same tab keys and icon treatment as legacy `BottemStack` (packages/mobile/App.tsx).
 * Tab bar height/padding follows the legacy Android default; iOS uses a close default.
 */
export function LegacyTabShell() {
  const tabBarHeight = Platform.OS === "android" ? Scale(75) : Scale(90);
  const tabPaddingBottom = Platform.OS === "android" ? Scale(15) : Scale(20);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: tabPaddingBottom
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.Roboto_Regular,
          fontSize: Scale(13)
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={WDashboard}
        options={{
          title: i18next.t("Dashboard"),
          tabBarIcon: ({ focused }) => (
            <LegacyTabBarIcon source={TAB_ICONS.dashboard} sizeHp={2.5} focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="Catalogue"
        component={WCatalogue}
        options={{
          title: i18next.t("Catalogue"),
          tabBarIcon: ({ focused }) => (
            <LegacyTabBarIcon source={TAB_ICONS.catalogue} sizeHp={2.9} focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={WLeaderboard}
        options={{
          title: i18next.t("Leaderboard"),
          tabBarIcon: ({ focused }) => (
            <LegacyTabBarIcon source={TAB_ICONS.leaderboard} sizeHp={2.8} focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="UserProfileBasicBlock"
        component={WProfile}
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <LegacyTabBarIcon source={TAB_ICONS.profile} sizeHp={3.5} focused={focused} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
