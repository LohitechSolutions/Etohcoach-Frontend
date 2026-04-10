import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useMemo } from "react";

import { getLegacyBlock } from "../migration/legacyBlockRegistry";
import { withLegacyCourseTabScreen } from "../migration/legacyCourseTabNavigation";
import { LegacyTabShell } from "./LegacyTabShell";

const CourseTab = createBottomTabNavigator();
const ThemesStack = createNativeStackNavigator();

/**
 * Nested themes stack — same route names as `themesRootStack` in `packages/mobile/App.tsx`.
 */
function CourseThemesStack() {
  const WThemes = useMemo(
    () => withLegacyCourseTabScreen(getLegacyBlock("Themes")!),
    []
  );
  const WProductCategory = useMemo(
    () => withLegacyCourseTabScreen(getLegacyBlock("CatalogueFive")!),
    []
  );
  const WCatalogueStudies = useMemo(
    () => withLegacyCourseTabScreen(getLegacyBlock("CatalogueStudy")!),
    []
  );
  const WCongratulation = useMemo(
    () => withLegacyCourseTabScreen(getLegacyBlock("Congratulation")!),
    []
  );

  return (
    <ThemesStack.Navigator initialRouteName="ThemesScreen" screenOptions={{ headerShown: false }}>
      <ThemesStack.Screen name="ThemesScreen" component={WThemes} />
      <ThemesStack.Screen name="ProductCategory" component={WProductCategory} />
      <ThemesStack.Screen name="CatalogueStudies" component={WCatalogueStudies} />
      <ThemesStack.Screen name="Congratulation" component={WCongratulation} />
    </ThemesStack.Navigator>
  );
}

/**
 * Mirrors legacy `BottemCourse`: main tabs under `Catalogue`, course `OverView`, themes stack
 * on `Leaderboard` tab key, and `Notes` on `UserProfileBasicBlock`. Tab bar is hidden like
 * legacy `tabBarVisible: false` on every tab.
 */
export function LegacyCourseTabShell() {
  const WOverView = useMemo(
    () => withLegacyCourseTabScreen(getLegacyBlock("OverView")!),
    []
  );
  const WNotes = useMemo(() => withLegacyCourseTabScreen(getLegacyBlock("Notes")!), []);

  return (
    <CourseTab.Navigator
      initialRouteName="OverView"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }
      }}
    >
      <CourseTab.Screen name="Catalogue" component={LegacyTabShell} options={{ title: "Back" }} />
      <CourseTab.Screen name="OverView" component={WOverView} options={{ title: "OverView" }} />
      <CourseTab.Screen name="Leaderboard" component={CourseThemesStack} options={{ title: "Themes" }} />
      <CourseTab.Screen name="UserProfileBasicBlock" component={WNotes} options={{ title: "Notes" }} />
    </CourseTab.Navigator>
  );
}
