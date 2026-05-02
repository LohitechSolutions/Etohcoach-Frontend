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

/** Walk up so `OverViews` / `QuizzesExamInit` resolve on the auth root stack (not the themes sub-stack). */
function tryNavigateOnAncestor(
  start: NavigationProp<ParamListBase>,
  routeName: string,
  params?: object
): boolean {
  let nav: NavigationProp<ParamListBase> | undefined = start;
  while (nav) {
    const st = nav.getState?.() as { routeNames?: string[] } | undefined;
    if (st?.routeNames?.includes(routeName)) {
      ((nav.navigate as unknown) as LooseNavigate)(routeName, params);
      return true;
    }
    nav = nav.getParent?.() as NavigationProp<ParamListBase> | undefined;
  }
  return false;
}

export function buildLegacyCourseTabNavigation<P extends ParamListBase, R extends keyof P>(
  navigation: NavigationProp<P>,
  route: RouteProp<P, R>
) {
  const base = buildLegacyNavigation(navigation, route);
  /** Sibling tab + nested stack targets must use the real `navigate` method, not the object. */
  const navigateTab = navigation.navigate.bind(navigation) as LooseNavigate;

  return {
    ...base,
    navigate: (name: string, params?: object) => {
      if (name === "OverViews" || name === "QuizzesExamInit") {
        if (tryNavigateOnAncestor(navigation as NavigationProp<ParamListBase>, name, params)) {
          return;
        }
      }
      if (name === "Themes" || name === "Themess") {
        navigateTab(LEGACY_COURSE_TAB_THEMES_STACK, { screen: "ThemesScreen", params });
        return;
      }
      if (name === "ProductCategory") {
        navigateTab(LEGACY_COURSE_TAB_THEMES_STACK, { screen: "ProductCategory", params });
        return;
      }
      if (name === "Notes") {
        navigateTab(LEGACY_COURSE_TAB_NOTES, params);
        return;
      }
      if (name === "OverView") {
        navigateTab(LEGACY_COURSE_TAB_OVERVIEW, params);
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
