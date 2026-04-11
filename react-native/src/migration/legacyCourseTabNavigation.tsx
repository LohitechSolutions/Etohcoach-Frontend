import { useNavigation, useRoute, type NavigationProp, type ParamListBase, type RouteProp } from "@react-navigation/native";
import React, { useMemo } from "react";
import type { ComponentType } from "react";

import { buildLegacyNavigation } from "./legacyNavigationCompat";

/** `BottemCourse` tab keys — mirror `packages/mobile/App.tsx`. */
export const LEGACY_COURSE_TAB_OVERVIEW = "OverView";
/** Themes stack lives on this tab (legacy mislabels it "Leaderboard"). */
export const LEGACY_COURSE_TAB_THEMES_STACK = "Leaderboard";
export const LEGACY_COURSE_TAB_NOTES = "UserProfileBasicBlock";

/**
 * Extends legacy navigation for screens inside `LegacyCourseTabShell` so calls like
 * `navigate("Themes")` / `navigate("ProductCategory")` target the nested themes stack,
 * matching react-navigation 2 `BottemCourse` + `themesRootStack` behavior.
 */
type LooseNavigate = (name: string, params?: object) => void;

export function buildLegacyCourseTabNavigation<P extends ParamListBase, R extends keyof P>(
  navigation: NavigationProp<P>,
  route: RouteProp<P, R>
) {
  const base = buildLegacyNavigation(navigation, route);
  const navLoose = navigation as unknown as LooseNavigate;

  return {
    ...base,
    navigate: (name: string, params?: object) => {
      if (name === "Themes" || name === "Themess") {
        navLoose(LEGACY_COURSE_TAB_THEMES_STACK, { screen: "ThemesScreen", params });
        return;
      }
      if (name === "ProductCategory") {
        navLoose(LEGACY_COURSE_TAB_THEMES_STACK, { screen: "ProductCategory", params });
        return;
      }
      if (name === "Notes") {
        navLoose(LEGACY_COURSE_TAB_NOTES, params);
        return;
      }
      if (name === "OverView") {
        navLoose(LEGACY_COURSE_TAB_OVERVIEW, params);
        return;
      }
      if (name === "Catalogue") {
        const courseTab = navigation.getParent?.();
        if (courseTab && typeof (courseTab as { navigate?: LooseNavigate }).navigate === "function") {
          (courseTab as { navigate: LooseNavigate }).navigate("Catalogue", params);
          return;
        }
      }
      (base.navigate as unknown as LooseNavigate)(name, params);
    }
  };
}

export function withLegacyCourseTabScreen<P extends { navigation?: unknown }>(
  Screen: ComponentType<P>
): ComponentType<Omit<P, "navigation">> {
  function CourseTabHost(props: Omit<P, "navigation">) {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const route = useRoute<RouteProp<ParamListBase, string>>();
    const legacyNav = useMemo(
      () => buildLegacyCourseTabNavigation(navigation, route),
      [navigation, route, route.params, route.name, route.key]
    );
    return <Screen {...(props as P)} navigation={legacyNav as P["navigation"]} />;
  }
  CourseTabHost.displayName = `LegacyCourseTab(${(Screen as { displayName?: string }).displayName || Screen.name || "Screen"})`;
  return CourseTabHost as ComponentType<Omit<P, "navigation">>;
}
