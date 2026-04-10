import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ComponentType } from "react";
import React from "react";
import { PlaceholderScreen } from "./PlaceholderScreen";
import { LEGACY_BLOCK_REGISTRY } from "../migration/legacyBlockRegistry";
import { withLegacyNavigation } from "../migration/legacyNavigationCompat";
import { authStackRoutes } from "./authStackRoutes";
import { LegacyTabShell } from "./LegacyTabShell";
import { nonAuthStackRoutes } from "./nonAuthStackRoutes";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const NonAuthStack = createNativeStackNavigator();

const Missing = withLegacyNavigation(
  PlaceholderScreen as unknown as ComponentType<{ navigation?: unknown }>
);
const WSplash = withLegacyNavigation(LEGACY_BLOCK_REGISTRY.Splashscreen);

function buildAuthScreens(): Record<string, ComponentType<Record<string, unknown>>> {
  const m: Record<string, ComponentType<Record<string, unknown>>> = {};
  for (const name of authStackRoutes) {
    if (name === "Dashboard") {
      m[name] = LegacyTabShell as ComponentType<Record<string, unknown>>;
    } else {
      const C = LEGACY_BLOCK_REGISTRY[name];
      m[name] = (C ? withLegacyNavigation(C) : Missing) as ComponentType<Record<string, unknown>>;
    }
  }
  return m;
}

function buildNonAuthScreens(): Record<string, ComponentType<Record<string, unknown>>> {
  const m: Record<string, ComponentType<Record<string, unknown>>> = {};
  for (const name of nonAuthStackRoutes) {
    const C = LEGACY_BLOCK_REGISTRY[name];
    m[name] = (C ? withLegacyNavigation(C) : Missing) as ComponentType<Record<string, unknown>>;
  }
  return m;
}

const AUTH_SCREENS = buildAuthScreens();
const NON_AUTH_SCREENS = buildNonAuthScreens();

function AuthenticatedNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      {authStackRoutes.map((name) => (
        <AuthStack.Screen key={name} name={name} component={AUTH_SCREENS[name]} />
      ))}
    </AuthStack.Navigator>
  );
}

function NonAuthenticatedNavigator() {
  return (
    <NonAuthStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      {nonAuthStackRoutes.map((name) => (
        <NonAuthStack.Screen key={name} name={name} component={NON_AUTH_SCREENS[name]} />
      ))}
    </NonAuthStack.Navigator>
  );
}

/** Legacy block UI under RN6 + nested stacks matching packages/mobile/App.tsx. */
export function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="SPLASH" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="SPLASH" component={WSplash} />
        <RootStack.Screen name="Splashscreen" component={WSplash} />
        <RootStack.Screen name="Authenticated" component={AuthenticatedNavigator} />
        <RootStack.Screen name="NonAuthenticated" component={NonAuthenticatedNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
