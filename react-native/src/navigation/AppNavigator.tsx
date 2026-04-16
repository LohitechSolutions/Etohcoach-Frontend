import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ComponentType } from "react";
import React from "react";
import { navigationRef } from "./rootNavigationRef";
import { getLegacyBlock } from "../migration/legacyBlockRegistry";
import { withLegacyNavigation } from "../migration/legacyNavigationCompat";
import { PlaceholderScreen } from "./PlaceholderScreen";
import { authStackRoutes } from "./authStackRoutes";
import { LegacyCourseTabShell } from "./LegacyCourseTabShell";
import { LegacyTabShell } from "./LegacyTabShell";
import { nonAuthStackRoutes } from "./nonAuthStackRoutes";
import { ComplianceOnboardingScreen } from "../compliance/ComplianceOnboardingScreen";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const NonAuthStack = createNativeStackNavigator();

const Missing = withLegacyNavigation(
  PlaceholderScreen as unknown as ComponentType<{ navigation?: unknown }>
);

const authScreenCache = new Map<string, ComponentType<Record<string, unknown>>>();
const nonAuthScreenCache = new Map<string, ComponentType<Record<string, unknown>>>();
let splashScreenCached: ComponentType<Record<string, unknown>> | undefined;

function getSplashScreen(): ComponentType<Record<string, unknown>> {
  if (!splashScreenCached) {
    const C = getLegacyBlock("Splashscreen");
    splashScreenCached = (C ? withLegacyNavigation(C) : Missing) as ComponentType<Record<string, unknown>>;
  }
  return splashScreenCached;
}

function getAuthScreen(name: (typeof authStackRoutes)[number]): ComponentType<Record<string, unknown>> {
  if (!authScreenCache.has(name)) {
    if (name === "Dashboard") {
      authScreenCache.set(name, LegacyTabShell as ComponentType<Record<string, unknown>>);
    } else if (name === "OverView") {
      authScreenCache.set(name, LegacyCourseTabShell as ComponentType<Record<string, unknown>>);
    } else {
      const C = getLegacyBlock(name);
      authScreenCache.set(
        name,
        (C ? withLegacyNavigation(C) : Missing) as ComponentType<Record<string, unknown>>
      );
    }
  }
  return authScreenCache.get(name)!;
}

function getNonAuthScreen(name: (typeof nonAuthStackRoutes)[number]): ComponentType<Record<string, unknown>> {
  if (!nonAuthScreenCache.has(name)) {
    const C = getLegacyBlock(name);
    nonAuthScreenCache.set(
      name,
      (C ? withLegacyNavigation(C) : Missing) as ComponentType<Record<string, unknown>>
    );
  }
  return nonAuthScreenCache.get(name)!;
}

function AuthenticatedNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      {authStackRoutes.map((name) => (
        <AuthStack.Screen
          key={name}
          name={name}
          getComponent={() => getAuthScreen(name)}
        />
      ))}
    </AuthStack.Navigator>
  );
}

function NonAuthenticatedNavigator() {
  return (
    <NonAuthStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      {nonAuthStackRoutes.map((name) => (
        <NonAuthStack.Screen
          key={name}
          name={name}
          getComponent={() => getNonAuthScreen(name)}
        />
      ))}
    </NonAuthStack.Navigator>
  );
}

/** Legacy block UI under RN6 + nested stacks matching packages/mobile/App.tsx. */
export function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator initialRouteName="SPLASH" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="SPLASH" getComponent={getSplashScreen} />
        <RootStack.Screen name="Splashscreen" getComponent={getSplashScreen} />
        <RootStack.Screen name="ComplianceOnboarding" component={ComplianceOnboardingScreen} />
        <RootStack.Screen name="Authenticated" component={AuthenticatedNavigator} />
        <RootStack.Screen name="NonAuthenticated" component={NonAuthenticatedNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
