import {
  CommonActions,
  useNavigation,
  useRoute,
  type NavigationProp,
  type ParamListBase,
  type RouteProp
} from "@react-navigation/native";
import React, { useMemo } from "react";
import type { ComponentType } from "react";

type LegacyResetRoute = {
  name: string;
  params?: Record<string, unknown>;
  state?: { routes: LegacyResetRoute[]; index: number };
};

/**
 * react-navigation 2.x StackActions.reset uses { type: 'Navigation/RESET', actions: [...] }.
 * RN6 only understands CommonActions.reset({ routes: [...] }).
 */
function legacyNavigateActionToRoute(action: Record<string, unknown> | null | undefined): LegacyResetRoute | null {
  if (!action || typeof action !== "object") {
    return null;
  }
  const routeName =
    (action.routeName as string) ||
    (action.payload as { routeName?: string } | undefined)?.routeName ||
    (action.payload as { name?: string } | undefined)?.name;
  if (!routeName) {
    return null;
  }
  const params =
    (action.params as Record<string, unknown>) ||
    (action.payload as { params?: Record<string, unknown> } | undefined)?.params;
  const inner = (action.action as Record<string, unknown> | undefined) ||
    (action.payload as { action?: Record<string, unknown> } | undefined)?.action;
  if (inner && typeof inner === "object") {
    const child =
      (inner.routeName as string) ||
      (inner.payload as { routeName?: string } | undefined)?.routeName;
    if (child) {
      const childParams =
        (inner.params as Record<string, unknown>) ||
        (inner.payload as { params?: Record<string, unknown> } | undefined)?.params;
      return {
        name: routeName,
        state: {
          routes: [childParams ? { name: child, params: childParams } : { name: child }],
          index: 0
        }
      };
    }
  }
  if (params && Object.keys(params).length > 0) {
    return { name: routeName, params };
  }
  return { name: routeName };
}

function convertLegacyResetAction(action: Record<string, unknown>): ReturnType<typeof CommonActions.reset> | null {
  const t = action.type as string;
  if (t !== "Navigation/RESET" && t !== "StackActions/RESET") {
    return null;
  }
  const legacyActions = (action.actions as Record<string, unknown>[] | undefined) || [];
  const index = typeof action.index === "number" ? action.index : 0;
  const routes = legacyActions
    .map((a) => legacyNavigateActionToRoute(a))
    .filter((r): r is LegacyResetRoute => r !== null);
  if (routes.length === 0) {
    return null;
  }
  return CommonActions.reset({
    index,
    routes: routes as never
  });
}

function createLegacyDispatch(navigation: NavigationProp<ParamListBase>) {
  return (incoming: { type: string; [k: string]: unknown }) => {
    const asRecord = incoming as Record<string, unknown>;
    const converted = convertLegacyResetAction(asRecord);
    if (converted) {
      return navigation.dispatch(converted);
    }
    return navigation.dispatch(incoming as never);
  };
}

/** Minimal react-navigation 2.x-shaped object for legacy block screens under RN6. */
export function buildLegacyNavigation<P extends ParamListBase, R extends keyof P>(
  navigation: NavigationProp<P>,
  route: RouteProp<P, R>
) {
  const params = (route.params ?? {}) as Record<string, unknown>;
  return {
    navigate: navigation.navigate.bind(navigation),
    goBack: navigation.goBack.bind(navigation),
    push: (screen: string, params?: object) => {
      const nav = navigation as { push?: (n: string, p?: object) => void };
      if (typeof nav.push === "function") {
        nav.push(screen, params);
      } else {
        const n = navigation as unknown as { navigate: (a: string, b?: object) => void };
        n.navigate(screen, params);
      }
    },
    pop: () => {
      const nav = navigation as { pop?: () => void };
      if (typeof nav.pop === "function") {
        nav.pop();
      } else {
        navigation.goBack();
      }
    },
    replace: (navigation as { replace?: (...a: unknown[]) => void }).replace?.bind(navigation),
    reset: (navigation as { reset?: (...a: unknown[]) => void }).reset?.bind(navigation),
    setParams: navigation.setParams.bind(navigation),
    dispatch: createLegacyDispatch(navigation),
    addListener: navigation.addListener.bind(navigation),
    isFocused: navigation.isFocused.bind(navigation),
    canGoBack: navigation.canGoBack.bind(navigation),
    getId: (navigation as { getId?: () => string }).getId?.bind(navigation),
    getParent: (navigation as { getParent?: () => unknown }).getParent?.bind(navigation),
    getState: (navigation as { getState?: () => unknown }).getState?.bind(navigation),
    getParam: (key: string, fallback?: unknown) =>
      params && key in params ? params[key] : fallback,
    state: {
      params,
      routeName: route.name,
      key: route.key
    }
  };
}

export function withLegacyNavigation<P extends { navigation?: unknown }>(
  Screen: ComponentType<P>
): ComponentType<Omit<P, "navigation">> {
  function LegacyHost(props: Omit<P, "navigation">) {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const route = useRoute<RouteProp<ParamListBase, string>>();
    const legacyNav = useMemo(
      () => buildLegacyNavigation(navigation, route),
      [navigation, route, route.params, route.name, route.key]
    );
    return <Screen {...(props as P)} navigation={legacyNav as P["navigation"]} />;
  }
  LegacyHost.displayName = `Legacy(${(Screen as { displayName?: string }).displayName || Screen.name || "Screen"})`;
  return LegacyHost as ComponentType<Omit<P, "navigation">>;
}
